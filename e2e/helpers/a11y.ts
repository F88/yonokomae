import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export type AxeImpact = 'minor' | 'moderate' | 'serious' | 'critical';

export async function runAxe(
  page: Page,
  options?: {
    tags?: string[];
    disableRules?: string[];
  },
) {
  let builder = new AxeBuilder({ page });
  if (options?.tags) builder = builder.withTags(options.tags);
  if (options?.disableRules)
    builder = builder.disableRules(options.disableRules);
  return builder.analyze();
}

export function filterViolations(
  results: Awaited<ReturnType<typeof runAxe>>,
  opts?: {
    failOnImpacts?: AxeImpact[]; // default: ['critical']
    allowRuleIds?: string[]; // known-issues allowed, e.g., ['color-contrast']
  },
) {
  const failOn = new Set(opts?.failOnImpacts ?? ['critical']);
  const allow = new Set(opts?.allowRuleIds ?? []);
  return results.violations.filter(
    (v) => failOn.has((v.impact ?? 'minor') as AxeImpact) && !allow.has(v.id),
  );
}
