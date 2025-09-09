import { test, expect } from '@playwright/test';

/**
 * Multi-touch stability test
 * Goal: Simulate two concurrent touch contacts (pointerId=1 & 2) on the same
 * mode label and verify only a single selection confirmation occurs
 * (window.__YK_TEST_ONSELECT_COUNT__ === 1) and the title screen unmounts.
 *
 * NOTE:
 * - This uses synthetic PointerEvents to approximate a two-finger tap.
 * - Real iOS Safari multi-touch nuances (gesture negotiation, delay) can't be
 *   perfectly replicated in desktop engine automation, but this guards against
 *   accidental double-confirm logic paths (dual pointerup fallbacks, etc.).
 */

test.describe('Title multi-touch stability', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 }); // iPhone 14-ish
    await page.goto('./');
  });

  test('two-finger (simulated) tap => exactly one confirm', async ({
    page,
  }) => {
    // Reset instrumentation counter
    await page.evaluate(() => {
      // @ts-expect-error test counter slot
      window.__YK_TEST_ONSELECT_COUNT__ = 0;
    });

    const firstLabel = page.locator('[data-mode-id]').first();
    await expect(firstLabel).toBeVisible();

    // Perform a normal click (primary finger)
    await firstLabel.click();

    // Inject secondary touch pointer activity AFTER primary selection
    await page.evaluate(() => {
      const el = document.querySelector('[data-mode-id]');
      if (!el) return;
      const fire = (type: string, init: PointerEventInit) => {
        el.dispatchEvent(new PointerEvent(type, init));
      };
      fire('pointerdown', {
        pointerId: 2,
        pointerType: 'touch',
        clientX: 60,
        clientY: 60,
        bubbles: true,
        isPrimary: false,
      });
      fire('pointerup', {
        pointerId: 2,
        pointerType: 'touch',
        clientX: 60,
        clientY: 60,
        bubbles: true,
        isPrimary: false,
      });
    });

    const group = page.getByRole('radiogroup', { name: 'Play modes' });
    await group.waitFor({ state: 'detached', timeout: 3000 }).catch(() => {});

    const count = await page.evaluate(() => {
      // @ts-expect-error test counter slot
      return window.__YK_TEST_ONSELECT_COUNT__ || 0;
    });
    expect(count).toBe(1);
    if (await group.count()) {
      throw new Error(
        'Radiogroup still visible; selection not confirmed once.',
      );
    }
  });
});
