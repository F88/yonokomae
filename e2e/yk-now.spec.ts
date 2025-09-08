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

    // Click the label text for yk-now (Japanese title)
    const ykNow = page.getByText('よのこまライブ', { exact: true });
    await expect(ykNow).toBeVisible();
    await ykNow.click();

    await assertModeSelectorAbsent(page);

    const badge = page.getByLabel(/Mode:\s+/);
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText(/よのこまライブ/);
    await expect(badge).not.toHaveText(/デモ \(ja\)/);
  });
});
