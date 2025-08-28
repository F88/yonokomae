import { expect, type Page } from '@playwright/test';

/**
 * Assert that header control buttons are visible on the TOP screen.
 * - Scroll to top
 * - Open user manual
 * - Toggle theme
 */
export async function assertHeaderControlsPresent(page: Page): Promise<void> {
  await expect(
    page.getByRole('button', { name: 'Scroll to top' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Open user manual' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Toggle theme' }),
  ).toBeVisible();
}

/**
 * Assert that header control buttons are not present/visible.
 * Useful in views where the header is intentionally hidden.
 */
export async function assertHeaderControlsAbsent(page: Page): Promise<void> {
  await expect(page.getByRole('button', { name: 'Scroll to top' })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole('button', { name: 'Open user manual' }),
  ).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Toggle theme' })).toHaveCount(
    0,
  );
}

/**
 * Assert that the mode selector is visible on the TOP screen.
 * - Title "SELECT MODE"
 * - Radiogroup labeled "Play modes"
 */
export async function assertModeSelectorPresent(page: Page): Promise<void> {
  await expect(page.getByText('SELECT MODE')).toBeVisible();
  await expect(
    page.getByRole('radiogroup', { name: 'Play modes' }),
  ).toBeVisible();
}

/**
 * Assert that the mode selector is not present (unmounted).
 */
export async function assertModeSelectorAbsent(page: Page): Promise<void> {
  await expect(page.getByText('SELECT MODE')).toHaveCount(0);
  await expect(
    page.getByRole('radiogroup', { name: 'Play modes' }),
  ).toHaveCount(0);
}

/**
 * Assert that the fixed controller footer is visible with key controls.
 * - Footer (role=contentinfo)
 * - Reset (R) button
 * - Battle (Enter, Space, or B) button
 */
export async function assertControllerPresent(page: Page): Promise<void> {
  await expect(page.locator('footer.sticky')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Battle' })).toBeVisible();
}

/**
 * Assert that the controller footer and its buttons are not present.
 */
export async function assertControllerAbsent(page: Page): Promise<void> {
  await expect(page.locator('footer.sticky')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Reset' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Battle' })).toHaveCount(0);
}

/**
 * Assert the number of rendered Battle Containers by data-testid.
 */
export async function assertBattleContainersCount(
  page: Page,
  count: number,
): Promise<void> {
  await expect(page.getByTestId('battle')).toHaveCount(count);
}

/**
 * Assert that no Battle Container is rendered.
 */
export async function assertNoBattleContainers(page: Page): Promise<void> {
  await assertBattleContainersCount(page, 0);
}
