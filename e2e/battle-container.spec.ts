/**
 * @fileoverview Battle Container E2E tests.
 *
 * Definition:
 * - "Battle Container" is the region where multiple battles are displayed
 *   in a grid layout after a mode is selected.
 *
 * Scope of this file:
 * - Validate the Battle Container itself: visibility, mounting/unmounting,
 *   and keyboard shortcuts or state transitions that affect the container as a whole.
 * - Limit checks to container-level behavior only.
 *
 * Non-goals:
 * - Do not test the rendering/content details of individual battles inside the container
 *   (cards, images, texts, etc.). Those are covered by dedicated specs.
 */
import { test, expect } from '@playwright/test';
import {
  assertBattleContainersCount,
  assertNoBattleContainers,
} from './helpers/visibility-assertions';

test.describe('Battle container visibility', () => {
  test('does not render any battle container before starting a game', async ({
    page,
  }) => {
    // show top page
    await page.goto('/');

    // container internals should not exist yet
    await assertNoBattleContainers(page);
    await expect(page.getByTestId('slot-yono')).toHaveCount(0);
    await expect(page.getByTestId('slot-komae')).toHaveCount(0);
  });

  test('renders one battle container after starting a game', async ({
    page,
  }) => {
    // show top page
    await page.goto('/');

    // select mode (game start)
    // Click the first enabled mode option to avoid Enter key side-effects
    const modeGroup = page.getByRole('radiogroup', { name: 'Play modes' });
    await modeGroup.locator('label').first().click();
    await page.getByRole('button', { name: 'Battle' }).click();

    // test: one container and its internals exist
    await assertBattleContainersCount(page, 1);
    await expect(page.getByTestId('slot-yono')).toHaveCount(1);
    await expect(page.getByTestId('slot-komae')).toHaveCount(1);
  });

  test('appends another battle container when Battle is clicked again', async ({
    page,
  }) => {
    // show top page
    await page.goto('/');

    // select mode (game start)
    const modeGroup = page.getByRole('radiogroup', { name: 'Play modes' });
    await modeGroup.locator('label').first().click();

    // generate first
    await page.getByRole('button', { name: 'Battle' }).click();
    await assertBattleContainersCount(page, 1);
    await expect(page.getByTestId('slot-yono')).toHaveCount(1);
    await expect(page.getByTestId('slot-komae')).toHaveCount(1);

    // generate second (use accessible name, not title)
    await page.getByRole('button', { name: 'Battle' }).click();

    // test: counts increment (two containers -> two slots per side)
    await assertBattleContainersCount(page, 2);
    await expect(page.getByTestId('slot-yono')).toHaveCount(2);
    await expect(page.getByTestId('slot-komae')).toHaveCount(2);
  });

  test('appends up to 10 battle containers when Battle is clicked repeatedly', async ({
    page,
  }) => {
    // show top page
    await page.goto('/');

    // select mode (game start)
    const modeGroup = page.getByRole('radiogroup', { name: 'Play modes' });
    await modeGroup.locator('label').first().click();

    // click Battle 10 times, verifying counts increment each time
    for (let i = 1; i <= 10; i++) {
      await page.getByRole('button', { name: 'Battle' }).click();
      await assertBattleContainersCount(page, i);
      await expect(page.getByTestId('slot-yono')).toHaveCount(i);
      await expect(page.getByTestId('slot-komae')).toHaveCount(i);
    }
  });

  test(
    'appends up to 100 battle containers when Battle is clicked repeatedly',
    {
      tag: ['@performance', '@slow'],
    },
    async ({ page }) => {
      test.slow();
      test.info().annotations.push({
        type: 'performance',
        description: 'Clicks Battle 100 times and verifies 100 containers',
      });

      // show top page
      await page.goto('/');

      // select mode (game start)
      const modeGroup = page.getByRole('radiogroup', { name: 'Play modes' });
      await modeGroup.locator('label').first().click();

      const battleBtn = page.getByRole('button', { name: 'Battle' });
      // Measure baseline count (should be 0)
      let prev = await page.getByTestId('battle').count();

      // click Battle 100 times, verifying counts are monotonically increasing
      for (let i = 1; i <= 100; i++) {
        await battleBtn.click();
        // Wait until the count increases beyond the previous value
        await expect
          .poll(async () => {
            return page.getByTestId('battle').count();
          })
          .toBeGreaterThan(prev);
        prev = await page.getByTestId('battle').count();
      }

      // Final sanity: we have at least 100 containers
      const finalCount = await page.getByTestId('battle').count();
      expect(finalCount).toBeGreaterThanOrEqual(100);
      // And slots exist for each container
      await expect(page.getByTestId('slot-yono')).toHaveCount(finalCount);
      await expect(page.getByTestId('slot-komae')).toHaveCount(finalCount);
    },
  );
});
