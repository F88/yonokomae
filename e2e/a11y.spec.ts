import { test, expect } from './fixtures/axe-test';

/**
 * Basic automated accessibility checks using axe-core.
 * Scans key screens and interactions for WCAG violations.
 */

test.describe('Accessibility (axe-core)', () => {
  test('TOP screen has no critical a11y violations', async ({
    page,
    analyzeA11y,
    expectNoA11yBlockers,
  }) => {
    await page.goto('/');
    const results = await analyzeA11y();
    await expectNoA11yBlockers(results, { failOnImpacts: ['critical'] });
  });

  test('After selecting DEMO and opening controller, page remains a11y clean', async ({
    page,
    analyzeA11y,
    expectNoA11yBlockers,
  }) => {
    await page.goto('/');
    // Confirm the currently highlighted mode via keyboard
    await page.getByRole('radiogroup', { name: 'Play modes' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Battle' })).toBeVisible();

    const results = await analyzeA11y();
    await expectNoA11yBlockers(results, { failOnImpacts: ['critical'] });
  });

  test('Generated battle reports should not introduce violations', async ({
    page,
    analyzeA11y,
    expectNoA11yBlockers,
  }) => {
    await page.goto('/');
    // Confirm the currently highlighted mode via keyboard
    await page.getByRole('radiogroup', { name: 'Play modes' }).focus();
    await page.keyboard.press('Enter');
    await page.getByRole('button', { name: 'Battle' }).click();

    const results = await analyzeA11y();
    await expectNoA11yBlockers(results, { failOnImpacts: ['critical'] });
  });
});
