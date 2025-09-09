import { test, expect } from '@playwright/test';

/**
 * Stability tests: single tap confirmation and duplicate prevention under touch emulation.
 * Scope:
 *  - Ensure exactly one selection confirmation per user tap.
 *  - Exercise rapid consecutive taps.
 *  - Verify no duplicate onSelect firing (instrumented via window.__YK_TEST_ONSELECT_COUNT__).
 */

test.describe('Title single-tap stability (touch)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone-ish
    await page.addInitScript(() => {
      // Flag to help emulate touch environment heuristics if needed.
      // Nothing required yet; kept for future.
    });
    await page.goto('./');
  });

  test('single tap confirms exactly once (current selection)', async ({
    page,
  }) => {
    // Ensure counter starts undefined or zero
    await page.evaluate(() => {
      // @ts-expect-error test counter slot
      window.__YK_TEST_ONSELECT_COUNT__ = 0;
    });

    // Tap the first visible radio label (current selection) once.
    const firstRadio = page.getByRole('radio').first();
    await firstRadio.click({ position: { x: 10, y: 10 } });

    // After transition title selector disappears -> confirmation happened.
    await expect(
      page.getByRole('radiogroup', { name: 'Play modes' }),
    ).toHaveCount(0);

    const count = await page.evaluate(() => {
      // @ts-expect-error test counter slot
      return window.__YK_TEST_ONSELECT_COUNT__ || 0;
    });
    expect(count).toBe(1);
  });

  test('rapid 5 taps => only 1 confirmation (guard works)', async ({
    page,
  }) => {
    await page.evaluate(() => {
      // @ts-expect-error test counter slot
      window.__YK_TEST_ONSELECT_COUNT__ = 0;
    });

    const firstRadio = page.getByRole('radio').first();
    for (let i = 0; i < 5; i++) {
      await firstRadio.click({ position: { x: 10, y: 10 } });
    }

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
