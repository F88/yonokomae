/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result as AxeViolation } from 'axe-core';

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder;
  analyzeA11y: (options?: {
    tags?: string[];
    disableRules?: string[];
    includeSelector?: string;
  }) => Promise<AxeResults>;
  expectNoA11yBlockers: (
    results: AxeResults,
    opts?: {
      failOnImpacts?: Array<'minor' | 'moderate' | 'serious' | 'critical'>;
      allowRuleIds?: string[];
      logNonFailing?: boolean; // default true
    },
  ) => Promise<void>;
};

export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']);
    await use(makeAxeBuilder);
  },
  analyzeA11y: async ({ makeAxeBuilder }, use) => {
    const analyze = async (options?: {
      tags?: string[];
      disableRules?: string[];
      includeSelector?: string;
    }) => {
      let builder = makeAxeBuilder();
      if (options?.tags) builder = builder.withTags(options.tags);
      if (options?.disableRules)
        builder = builder.disableRules(options.disableRules);
      if (options?.includeSelector)
        builder = builder.include(options.includeSelector);
      return builder.analyze();
    };
    await use(analyze);
  },
  // eslint-disable-next-line no-empty-pattern
  expectNoA11yBlockers: async ({}, use) => {
    function filterViolations(
      results: AxeResults,
      opts?: {
        failOnImpacts?: Array<'minor' | 'moderate' | 'serious' | 'critical'>;
        allowRuleIds?: string[];
      },
    ) {
      const failOn = new Set(opts?.failOnImpacts ?? ['critical']);
      const allow = new Set(opts?.allowRuleIds ?? []);
      return (results?.violations ?? []).filter(
        (v: AxeViolation) =>
          failOn.has(v.impact ?? 'minor') && !allow.has(v.id),
      );
    }

    const assertFn = async (
      results: AxeResults,
      opts?: {
        failOnImpacts?: Array<'minor' | 'moderate' | 'serious' | 'critical'>;
        allowRuleIds?: string[];
        logNonFailing?: boolean;
      },
    ) => {
      // Defaults controlled by env
      const isStrict =
        process.env.A11Y_STRICT === '1' || process.env.CI === 'true';
      const defaultAllow = isStrict ? [] : ['color-contrast'];

      if (opts?.logNonFailing !== false && results?.violations?.length) {
        // Log non-blocking violations for visibility
        console.log(
          'axe violations (non-failing):',
          results.violations.map((v: AxeViolation) => ({
            id: v.id,
            impact: v.impact,
          })),
        );
      }
      const blockers = filterViolations(results, {
        failOnImpacts: opts?.failOnImpacts ?? ['critical'],
        allowRuleIds: opts?.allowRuleIds ?? defaultAllow,
      });
      expect(blockers).toEqual([]);
    };
    await use(assertFn);
  },
});

export { expect } from '@playwright/test';
