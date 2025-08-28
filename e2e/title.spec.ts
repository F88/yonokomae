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

const MODE = {
  DEMO: 'DEMO',
  MIXED: 'MIXED NUTS',
  HISTORICAL: 'HISTORICAL RESEARCH',
  AI: 'AI MODE',
  API: 'API MODE',
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

      // Header title
      await expect(
        page.getByRole('heading', { name: 'yonokomae' }),
      ).toBeVisible();

      // Intro title
      await expect(
        page.getByRole('heading', { name: 'Yono vs Komae Battle Simulator' }),
      ).toBeVisible();

      // Mode selector title and radiogroup
      await assertModeSelectorPresent(page);
      const group = by.modeGroup(page);
      await expect(group).toBeVisible();

      // Default selection is DEMO
      await expect(group.getByLabel(MODE.DEMO)).toBeChecked();

      // Header controls are visible
      await assertHeaderControlsPresent(page);

      // How to play section is visible
      await expect(
        page.getByRole('heading', { name: 'How to play' }),
      ).toBeVisible();
      // Avoid brittle long-copy assertions that change frequently.

      // Radios: exact count and states (viewport-independent)
      await expect(group.getByRole('radio')).toHaveCount(5);
      await expect(group.getByLabel(MODE.MIXED)).toBeEnabled();
      await expect(group.getByLabel(MODE.HISTORICAL)).toBeEnabled();
      await expect(group.getByLabel(MODE.AI)).toBeDisabled();
      await expect(group.getByLabel(MODE.API)).toBeDisabled();

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
      await expect(page.getByLabel('Mode: DEMO')).toHaveCount(0);
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

      // Initially, the first enabled option (DEMO) is selected
      await expect(by.modeRadio(page, MODE.DEMO)).toBeChecked();

      // ArrowDown moves to next enabled option (MIXED NUTS)
      await page.keyboard.press('ArrowDown');
      await expect(by.modeRadio(page, MODE.MIXED)).toBeChecked();

      // End jumps to the last enabled option (HISTORICAL RESEARCH)
      await page.keyboard.press('End');
      await expect(by.modeRadio(page, MODE.HISTORICAL)).toBeChecked();

      // Home jumps back to the first enabled option (DEMO)
      await page.keyboard.press('Home');
      await expect(by.modeRadio(page, MODE.DEMO)).toBeChecked();

      // Enter confirms selection -> controller appears, title screen hides
      await page.keyboard.press('Enter');
      await assertModeSelectorAbsent(page);
      await expect(page.getByLabel('Mode: DEMO')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Battle' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();

      // Keyboard shortcut: 'R' resets -> back to TOP screen
      await page.keyboard.press('R');
      await assertModeSelectorPresent(page);
      await expect(page.getByLabel('Mode: DEMO')).toHaveCount(0);
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

    test('Historical seed selector has an accessible name on highlight', async ({
      page,
    }) => {
      await test.step('Preparation', async () => {
        // Go to the top screen
        await page.goto('/');
      });
      // Move highlight to HISTORICAL RESEARCH (last enabled in the list)
      await page.keyboard.press('End');
      await expect(by.modeRadio(page, MODE.HISTORICAL)).toBeChecked();
      // Seed selector becomes visible on title screen before confirming mode
      await expect(
        page.getByRole('combobox', { name: 'Historical seed selector' }),
      ).toBeVisible();
      await expect(page.getByRole('button', { name: 'Rotate' })).toBeVisible();
    });
  });

  /**
   * After a mode is selected (click DEMO):
   * - Title screen unmounts (mode selector disappears)
   * - Header shows mode badge (Mode: DEMO)
   * - Controller footer appears with Reset and Battle buttons
   * - Reset returns to the TOP screen
   */
  test.describe('After mode selected', () => {
    test('shows Controller and mode after clicking DEMO', async ({ page }) => {
      await test.step('Preparation', async () => {
        // Go to the top screen
        await page.goto('/');
        // Precondition: mode selector is visible before choosing a mode
        await assertModeSelectorPresent(page);
      });

      await test.step('Select mode "DEMO"', async () => {
        // Select mode "DEMO"
        await page.getByText(MODE.DEMO, { exact: true }).click();
      });

      // Mode selector disappears (component unmounted)
      await assertModeSelectorAbsent(page);

      // Header shows selected mode badge
      await expect(page.getByLabel('Mode: DEMO')).toBeVisible();

      // Controller is shown with Reset and Battle buttons
      await assertControllerPresent(page);

      // Reset returns to title screen (mode cleared, controller hidden)
      await page.getByRole('button', { name: 'Reset' }).click();

      await assertModeSelectorPresent(page);
      await expect(page.getByLabel('Mode: DEMO')).toHaveCount(0);
      await assertControllerAbsent(page);

      // Header controls on TOP should be visible again
      await assertHeaderControlsPresent(page);
    });
  });
});
