import { test, expect } from '@playwright/test';

/**
 * E2E: Reduced Motion behavior
 * - Emulate prefers-reduced-motion
 * - Verify marquee renders without long animations
 * - (Optional) Verify carousel autoplay does not advance automatically
 */

test.describe('Reduced Motion', () => {
  test.use({
    colorScheme: 'light',
    // Emulate reduced motion
    // @ts-expect-error supported at runtime
    reducedMotion: 'reduce',
  });

  test('User Manual carousel does not autoplay under reduced motion', async ({
    page,
  }) => {
    await page.goto('./');
    // Open dialog that contains a Carousel instance
    await page.getByRole('button', { name: 'Open user manual' }).click();
    // Locate the carousel region by data-slot set in our component
    const region = page.locator('[data-slot="carousel"]');
    await expect(region).toBeVisible();

    const track = region.locator('[data-slot="carousel-content"] > div');
    const t1 = await track.evaluate((el) => getComputedStyle(el).transform);
    await page.waitForTimeout(800);
    const t2 = await track.evaluate((el) => getComputedStyle(el).transform);
    expect(t2).toBe(t1);
  });
});
