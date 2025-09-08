import { test, expect } from '@playwright/test';

/**
 * @summary Minimal smoke test to ensure the app is reachable.
 */
test.describe('Smoke', () => {
  test('app responds at /', async ({ page }) => {
    const resp = await page.goto('./');
    expect(resp?.ok()).toBeTruthy();
  });
});
