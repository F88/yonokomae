import { test, expect } from './fixtures/axe-test';

/**
 * Accessibility scan focused on the User Manual dialog only, on desktop and mobile projects.
 */

test.describe('Dialog accessibility (User Manual)', () => {
  test('User Manual dialog has no critical a11y violations', async ({
    page,
    analyzeA11y,
    expectNoA11yBlockers,
  }) => {
    await page.goto('./');

    // Open dialog
    await page.getByRole('button', { name: 'Open user manual' }).click();
    const dialog = page.getByRole('dialog');

    // Ensure dialog is visible before scanning
    await expect(dialog).toBeVisible();

    // Scan only the dialog region to reduce noise from the underlying page
    const results = await analyzeA11y({ includeSelector: '[role="dialog"]' });
    await expectNoA11yBlockers(results, { failOnImpacts: ['critical'] });

    // Close dialog with Escape to match typical SR flows
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });
});
