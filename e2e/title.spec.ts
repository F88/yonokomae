import { test, expect } from '@playwright/test';
import {
  assertHeaderControlsPresent,
  assertControllerAbsent,
  assertControllerPresent,
  assertModeSelectorAbsent,
  assertModeSelectorPresent,
} from './helpers/visibility-assertions';
import type { Page } from '@playwright/test';

// Centralized role/name-based locators to avoid brittle id selectors
const by = {
  modeGroup: (page: Page) =>
    page.getByRole('radiogroup', { name: 'Play modes' }),
  // Radios are visually hidden and named by their <label>; use getByLabel.
  modeRadio: (page: Page, name: string) => page.getByLabel(name),
  modeBadge: (page: Page, mode: string) => page.getByLabel(`Mode: ${mode}`),
} as const;

// DOM ids used by TitleContainer for aria-activedescendant
const MODE_IDS = {
  HISTORICAL: 'play-mode-historical-research',
  MIXED: 'play-mode-mixed-nuts',
} as const;

// Helpers for viewport-conditional assertions
async function isSmUp(page: Page): Promise<boolean> {
  const size = page.viewportSize();
  return !!size && size.width >= 640; // Tailwind 'sm' breakpoint
}

/**
 * Title screen (TOP screen) e2e tests.
 * Scope:
 * - What must be visible on first load (before selecting any mode)
 * - What must not exist until a mode is selected
 * - What appears after selecting a mode and after resetting
 * Non-goals: keyboard navigation and battle flow (covered elsewhere).
 */
test.describe('Title', () => {
  /**
   * Initial display (before selecting any mode).
   * Ensures header/intro/mode selector are visible and controller/mode badge
   * are not present yet.
   */
  test.describe('Initial display', () => {
    test('shows TOP screen', async ({ page }) => {
      await test.step('Preparation', async () => {
        // Go to the top screen
        await page.goto('/');
      });

      // Header title is localized; ensure at least one heading is visible
      await expect(page.getByRole('heading').first()).toBeVisible();

      // Intro title
      await expect(
        page.getByRole('heading', { name: 'Yono vs Komae Battle Simulator' }),
      ).toBeVisible();

      // Mode selector title and radiogroup
      await assertModeSelectorPresent(page);
      const group = by.modeGroup(page);
      await expect(group).toBeVisible();

      // Default selection is the first enabled option
      await expect(group.getByRole('radio').first()).toBeChecked();

      // Header controls are visible
      await assertHeaderControlsPresent(page);

      // Avoid brittle copy assertions that change frequently.

      // Radios: verify there are several options without relying on exact labels
      const radioCount = await group.getByRole('radio').count();
      expect(radioCount).toBeGreaterThanOrEqual(5);

      // Viewport-dependent visual hints: desktop chips vs mobile short text
      const desktopHints = page
        .locator('div.hidden.sm\\:flex')
        .filter({ hasText: 'Enter' });
      const mobileHint = page
        .locator('div.sm\\:hidden')
        .filter({ hasText: /Use ↓\/↑ to choose/i });
      if (await isSmUp(page)) {
        await expect(desktopHints).toBeVisible();
        // If mobile hint exists, it should not be visible on >= sm
        if ((await mobileHint.count()) > 0) {
          await expect(mobileHint).not.toBeVisible();
        }
      } else {
        // On < sm, desktop chips should not be visible
        await expect(desktopHints).not.toBeVisible();
        // Mobile hint is optional; only assert visibility if it exists
        if ((await mobileHint.count()) > 0) {
          await expect(mobileHint).toBeVisible();
        }
      }

      // Controller should not be present yet
      await assertControllerAbsent(page);
      await expect(page.getByRole('button', { name: /reset/i })).toHaveCount(0);

      // Header controls are visible on TOP
      await assertHeaderControlsPresent(page);
      await expect(page.getByLabel(/Mode:\s+/)).toHaveCount(0);
    });
  });

  /**
   * Mode selector keyboard interaction tests.
   * Verifies navigation keys (ArrowUp/Down, Home/End) and Enter confirmation.
   */
  test.describe('Keyboard shortcuts', () => {
    test('supports mode navigation and selection via keyboard', async ({
      page,
    }) => {
      await test.step('Preparation', async () => {
        // Go to the top screen
        await page.goto('/');
      });

      // Mode selector visible
      await assertModeSelectorPresent(page);

      // Initially, the first enabled option is selected
      const group = by.modeGroup(page);
      await expect(group.getByRole('radio').first()).toBeChecked();

      // ArrowDown moves to next enabled option
      await page.keyboard.press('ArrowDown');
      await expect(group.getByRole('radio').nth(1)).toBeChecked();

      // End jumps to the last enabled option
      await page.keyboard.press('End');
      await expect(group).toHaveAttribute(
        'aria-activedescendant',
        MODE_IDS.MIXED,
      );

      // Home jumps back to the first enabled option
      await page.keyboard.press('Home');
      await expect(group).toHaveAttribute(
        'aria-activedescendant',
        MODE_IDS.HISTORICAL,
      );

      // Enter confirms selection -> controller appears, title screen hides
      await page.keyboard.press('Enter');
      await assertModeSelectorAbsent(page);
      await expect(page.getByLabel(/Mode:\s+/)).toBeVisible();
      await expect(page.getByRole('button', { name: 'Battle' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();

      // Keyboard shortcut: 'R' resets -> back to TOP screen
      await page.keyboard.press('R');
      await assertModeSelectorPresent(page);
      await expect(page.getByLabel(/Mode:\s+/)).toHaveCount(0);
    });
  });

  test.describe('A11y surfaces', () => {
    test('radiogroup exposes operation hint via aria-describedby', async ({
      page,
    }) => {
      await test.step('Preparation', async () => {
        // Go to the top screen
        await page.goto('/');
      });
      const group = page.getByRole('radiogroup', { name: 'Play modes' });
      await expect(group).toBeVisible();
      const describedBy = await group.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      const hint = page.locator(`#${describedBy}`);
      await expect(hint).toHaveText(/Use Arrow keys to choose/i);
    });

    // Seed selector UI is currently not displayed on title screen; skipping.
  });

  /**
   * After a mode is selected (click DEMO):
   * - Title screen unmounts (mode selector disappears)
   * - Header shows mode badge (Mode: DEMO)
   * - Controller footer appears with Reset and Battle buttons
   * - Reset returns to the TOP screen
   */
  test.describe('After mode selected', () => {
    test('shows Controller and mode after confirming a selection', async ({
      page,
    }) => {
      await test.step('Preparation', async () => {
        // Go to the top screen
        await page.goto('/');
        // Precondition: mode selector is visible before choosing a mode
        await assertModeSelectorPresent(page);
      });

      await test.step('Confirm current selection', async () => {
        // Focus the radiogroup and confirm selection via keyboard
        const group = by.modeGroup(page);
        await group.focus();
        await page.keyboard.press('Enter');
      });

      // Mode selector disappears (component unmounted)
      await assertModeSelectorAbsent(page);

      // Header shows selected mode badge (localized)
      await expect(page.getByLabel(/Mode:\s+/)).toBeVisible();

      // Controller is shown with Reset and Battle buttons
      await assertControllerPresent(page);

      // Reset returns to title screen (mode cleared, controller hidden)
      await page.getByRole('button', { name: 'Reset' }).click();

      await assertModeSelectorPresent(page);
      await expect(page.getByLabel(/Mode:\s+/)).toHaveCount(0);
      await assertControllerAbsent(page);

      // Header controls on TOP should be visible again
      await assertHeaderControlsPresent(page);
    });
  });
});
