import { test, expect } from '@playwright/test';
import {
  assertModeSelectorPresent,
  assertModeSelectorAbsent,
} from './helpers/visibility-assertions';

/**
 * Regression test: selecting 'よのこまライブ' (yk-now) must NOT show demo badge text.
 * Ensures iOS mis-selection bug does not reappear.
 */
test.describe('Play mode: yk-now regression', () => {
  test('selecting yk-now shows correct header badge and not demo', async ({
    page,
  }) => {
    await page.goto('./');
    await assertModeSelectorPresent(page);

    // Click the label element for yk-now using data-mode-id attribute for precision
    const ykNowLabel = page.locator('label[data-mode-id="yk-now"]');
    await expect(ykNowLabel).toBeVisible();
    
    // Click and wait for the controller to appear (confirms click was processed)
    await ykNowLabel.click();
    await expect(page.getByRole('button', { name: 'Battle' })).toBeVisible({ timeout: 10000 });

    // Now the mode selector should be gone
    await assertModeSelectorAbsent(page);

    const badge = page.getByLabel(/Mode:\s+/);
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText(/よのこまライブ/);
    await expect(badge).not.toHaveText(/デモ \(ja\)/);
  });
});
