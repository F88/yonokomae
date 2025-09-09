import { test, expect } from '@playwright/test';

/**
 * Delayed click scenario: simulate artificial delay close to guard threshold to ensure
 * we still only confirm one selection.
 */

test.describe('Title delayed click guard scenario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('artificial delayed click does not cause duplicate confirmation', async ({
    page,
  }) => {
    await page.evaluate(() => {
      // @ts-expect-error test counter slot
      window.__YK_TEST_ONSELECT_COUNT__ = 0;
    });

    const firstRadio = page.getByRole('radio').first();

    // Inject a small delay between pointerdown and click by dispatching events manually.
    await firstRadio.dispatchEvent('pointerdown');
    await page.waitForTimeout(140); // slightly above 120ms guard to test resilience
    await firstRadio.dispatchEvent('click');

    await expect(
      page.getByRole('radiogroup', { name: 'Play modes' }),
    ).toHaveCount(0);
    const count = await page.evaluate(() => {
      // @ts-expect-error test counter slot
      return window.__YK_TEST_ONSELECT_COUNT__ || 0;
    });
    expect(count).toBe(1);
  });
});
