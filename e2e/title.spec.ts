import { test, expect } from '@playwright/test';
import {
  assertHeaderControlsPresent,
  assertControllerAbsent,
  assertControllerPresent,
  assertModeSelectorAbsent,
  assertModeSelectorPresent,
} from './helpers/visibility-assertions';

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
      // Go to the top screen
      await page.goto('/');

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

      // Default selection is DEMO
      await expect(page.locator('#play-mode-demo')).toBeChecked();

      // Header controls are visible
      await assertHeaderControlsPresent(page);

      // How to play section is visible
      await expect(
        page.getByRole('heading', { name: 'How to play' }),
      ).toBeVisible();
      await expect(
        page.getByText(
          'This thought-provoking game explores the outcomes for two countries',
        ),
      ).toBeVisible();

      // Mode options are listed
      await expect(page.getByText('DEMO', { exact: true })).toBeVisible();
      await expect(page.getByText('MIXED NUTS', { exact: true })).toBeVisible();
      await expect(
        page.getByText('HISTORICAL RESEARCH', { exact: true }),
      ).toBeVisible();
      await expect(page.getByText('AI MODE', { exact: true })).toBeVisible();
      await expect(page.getByText('API MODE', { exact: true })).toBeVisible();

      // Disabled modes should be disabled
      await expect(page.locator('#play-mode-ai-mode')).toBeDisabled();
      await expect(page.locator('#play-mode-api')).toBeDisabled();

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
      // Go to the top screen
      await page.goto('/');

      // Mode selector visible
      await assertModeSelectorPresent(page);

      // Initially, the first enabled option (DEMO) is selected
      await expect(page.locator('#play-mode-demo')).toBeChecked();

      // ArrowDown moves to next enabled option (MIXED NUTS)
      await page.keyboard.press('ArrowDown');
      await expect(page.locator('#play-mode-mixed-nuts')).toBeChecked();

      // End jumps to the last enabled option (HISTORICAL EVIDENCES)
      await page.keyboard.press('End');
      await expect(
        page.locator('#play-mode-historical-evidences'),
      ).toBeChecked();

      // Home jumps back to the first enabled option (DEMO)
      await page.keyboard.press('Home');
      await expect(page.locator('#play-mode-demo')).toBeChecked();

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
      await page.goto('/');
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
      await page.goto('/');
      // Move highlight to HISTORICAL EVIDENCES (last enabled in the list)
      await page.keyboard.press('End');
      await expect(
        page.locator('#play-mode-historical-evidences'),
      ).toBeChecked();
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
      // Go to the top screen
      await page.goto('/');

      // Precondition: mode selector is visible before choosing a mode
      await assertModeSelectorPresent(page);

      // Select mode "DEMO"
      await page.getByText('DEMO', { exact: true }).click();

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
