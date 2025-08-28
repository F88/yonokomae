import { test, expect } from '@playwright/test';
import { assertModeSelectorPresent } from './helpers/visibility-assertions';

/**
 * @summary Minimal smoke test to ensure the app is reachable.
 */
test.describe('Top', () => {
  test('app responds at /', async ({ page }) => {
    const resp = await page.goto('/');
    expect(resp?.ok()).toBeTruthy();
  });

  // Elements
  test('shows elements on initial TOP screen', async ({ page }) => {
    await page.goto('/');

    // Header title
    await expect(
      page.getByRole('heading', { name: 'yonokomae' }),
    ).toBeVisible();

    // Mode selector
    await assertModeSelectorPresent(page);

    // Intro
    await expect(
      page.getByRole('heading', { name: 'Yono vs Komae Battle Simulator' }),
    ).toBeVisible();
  });
});
