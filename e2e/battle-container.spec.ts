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
    await page.getByText('DEMO', { exact: true }).click();
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
    await page.getByText('DEMO', { exact: true }).click();

    // generate first
    await page.getByRole('button', { name: 'Battle' }).click();
    await assertBattleContainersCount(page, 1);
    await expect(page.getByTestId('slot-yono')).toHaveCount(1);
    await expect(page.getByTestId('slot-komae')).toHaveCount(1);

    // generate second
    await page
      .getByRole('button', { name: 'Battle (Enter, Space, or B)' })
      .click();

    // test: counts increment (two containers -> two slots per side)
    await assertBattleContainersCount(page, 2);
    await expect(page.getByTestId('slot-yono')).toHaveCount(2);
    await expect(page.getByTestId('slot-komae')).toHaveCount(2);
  });
});
