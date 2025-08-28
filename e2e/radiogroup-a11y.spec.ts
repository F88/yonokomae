import { test, expect } from './fixtures/axe-test';
import type { Page } from '@playwright/test';

/**
 * A11y checks specific to the mode selector radiogroup on the Title screen.
 * - Focus ring visibility on keyboard focus (always on)
 * - Optional color-contrast check scoped to the radiogroup (gate by env)
 */

async function focusRadiogroupByTabbing(page: Page) {
  const group = page.getByRole('radiogroup', { name: 'Play modes' });
  await group.scrollIntoViewIfNeeded();

  // Walk focus forward until the group receives focus
  for (let i = 0; i < 40; i++) {
    const isFocused = await group.evaluate(
      (el) => el === document.activeElement,
    );
    if (isFocused) return;
    await page.keyboard.press('Tab');
  }
}

test.describe('Title radiogroup a11y', () => {
  test('shows a visible focus ring on keyboard focus', async ({ page }) => {
    await page.goto('/');
    const group = page.getByRole('radiogroup', { name: 'Play modes' });
    await expect(group).toBeVisible();

    await focusRadiogroupByTabbing(page);
    await expect(group).toBeFocused();

    const hasVisibleFocus = await group.evaluate((el) => {
      const cs = window.getComputedStyle(el as HTMLElement);
      const hasOutline =
        cs.outlineStyle !== 'none' &&
        cs.outlineWidth !== '0px' &&
        cs.outlineColor !== 'transparent';
      const hasBoxShadow = cs.boxShadow !== 'none'; // Tailwind ring uses box-shadow
      const focusVisible = (el as HTMLElement).matches(':focus-visible');
      return focusVisible && (hasOutline || hasBoxShadow);
    });

    expect(hasVisibleFocus).toBe(true);
  });

  test('radiogroup passes color-contrast (scoped, env-gated)', async ({
    page,
    makeAxeBuilder,
  }) => {
    test.skip(
      !process.env.A11Y_CONTRAST,
      'Contrast check is gated by env A11Y_CONTRAST=1',
    );

    await page.goto('/');
    const group = page.getByRole('radiogroup', { name: 'Play modes' });
    await expect(group).toBeVisible();

    const results = await makeAxeBuilder()
      .include('[role="radiogroup"][aria-label="Play modes"]')
      .analyze();

    const contrastViolations = results.violations.filter(
      (v) => v.id === 'color-contrast',
    );
    expect(
      contrastViolations,
      JSON.stringify(contrastViolations, null, 2),
    ).toEqual([]);
  });
});
