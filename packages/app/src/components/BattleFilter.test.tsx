/* @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BattleFilter } from './BattleFilter';

vi.mock('@yonokomae/data-battle-seeds', () => ({
  publishStateKeys: ['published', 'draft', 'review', 'archived'],
  battleSeedsByFile: {
    'a-history.js': {
      title: 'Alpha History',
      themeId: 'history',
      publishState: 'published',
    },
    'b-tech.js': {
      title: 'Beta Tech',
      themeId: 'technology',
      publishState: 'draft',
    },
    'c-history.js': {
      title: 'Gamma History',
      themeId: 'history',
      publishState: 'review',
    },
    'd-culture.js': {
      title: 'Delta Culture',
      themeId: 'culture',
      publishState: 'published',
    },
  },
}));

describe('BattleFilter (chip single-select)', () => {
  it('renders wrapper, All chip active, and list with all battles by default', () => {
    render(<BattleFilter />);
    expect(screen.getByTestId('battle-filter-wrapper')).toBeTruthy();
    const allChip = screen.getByTestId('battle-filter-chip-all');
    expect(allChip.getAttribute('data-selected')).toBe('true');
    const list = screen.getByTestId('battle-filter-list');
    expect(list.textContent).toContain('Alpha History');
    expect(list.textContent).toContain('Beta Tech');
    expect(list.textContent).toContain('Gamma History');
    expect(list.textContent).toContain('Delta Culture');
  });

  it('selecting a theme filters list; returning to All restores full list (not hidden)', () => {
    render(<BattleFilter />);
    const historyChip = screen.getByTestId('battle-filter-chip-history');
    fireEvent.click(historyChip);
    const listFiltered = screen.getByTestId('battle-filter-list');
    expect(listFiltered.textContent).toContain('Alpha History');
    expect(listFiltered.textContent).toContain('Gamma History');
    expect(listFiltered.textContent).not.toContain('Beta Tech');
    // Back to All should show all battles again
    fireEvent.click(screen.getByTestId('battle-filter-chip-all'));
    const listAll = screen.getByTestId('battle-filter-list');
    expect(listAll.textContent).toContain('Alpha History');
    expect(listAll.textContent).toContain('Beta Tech');
  });

  it('themeIdsFilter restricts universe (technology only)', () => {
    render(<BattleFilter themeIdsFilter={['technology']} />);
    const listInitial = screen.getByTestId('battle-filter-list');
    expect(listInitial.textContent).toContain('Beta Tech');
    expect(listInitial.textContent).not.toContain('Alpha History');
    // Only technology chip should exist besides All
    expect(screen.queryByTestId('battle-filter-chip-history')).toBeNull();
  });

  it('respects showBattleChips=false (list stays hidden even after selecting)', () => {
    render(<BattleFilter showBattleChips={false} />);
    // Select a theme
    fireEvent.click(screen.getByTestId('battle-filter-chip-history'));
    expect(screen.queryByTestId('battle-filter-list')).toBeNull();
  });

  it('hides battle count when showBattleCount=false', () => {
    render(<BattleFilter showBattleCount={false} />);
    // count badge absent
    expect(
      screen.queryByTitle('Filtered count') ||
        screen.queryByTestId('battle-filter-count'),
    ).toBeNull();
  });

  it('adds ring styling (ring-2) only to active theme chip', () => {
    render(<BattleFilter />);
    const historyChipButton = screen.getByTestId('battle-filter-chip-history');
    fireEvent.click(historyChipButton);
    // Active ThemeChip should have ring-2 class (and border-ring)
    const activeChip = historyChipButton.querySelector(
      '[data-testid="theme-chip"]',
    );
    expect(activeChip?.className).toMatch(/ring-2/);
    // Inactive technology chip should not have ring-2
    const techButton = screen.getByTestId('battle-filter-chip-technology');
    const inactiveChip = techButton.querySelector('[data-testid="theme-chip"]');
    expect(inactiveChip?.className).not.toMatch(/ring-2/);
  });

  it('shows publishState select and filters by publishState', () => {
    render(<BattleFilter />);
    const psSelect = screen.getByTestId(
      'battle-filter-publish-state',
    ) as HTMLSelectElement;
    // Ensure options include states with counts (draft, review etc.)
    expect(Array.from(psSelect.options).some((o) => o.value === 'draft')).toBe(
      true,
    );
    fireEvent.change(psSelect, { target: { value: 'draft' } });
    const list = screen.getByTestId('battle-filter-list');
    expect(list.textContent).toContain('Beta Tech');
    expect(list.textContent).not.toContain('Alpha History');
    expect(list.textContent).not.toContain('Gamma History');
  });

  it('combines theme + publishState filters (history + review)', () => {
    render(<BattleFilter />);
    // theme: history
    fireEvent.click(screen.getByTestId('battle-filter-chip-history'));
    const psSelect = screen.getByTestId(
      'battle-filter-publish-state',
    ) as HTMLSelectElement;
    fireEvent.change(psSelect, { target: { value: 'review' } });
    const list = screen.getByTestId('battle-filter-list');
    expect(list.textContent).toContain('Gamma History');
    expect(list.textContent).not.toContain('Alpha History');
  });

  it('disabled option appears for 0-count state (archived)', () => {
    render(<BattleFilter />);
    const psSelect = screen.getByTestId(
      'battle-filter-publish-state',
    ) as HTMLSelectElement;
    const archived = Array.from(psSelect.options).find(
      (o) => o.value === 'archived',
    );
    expect(archived).toBeTruthy();
    expect(archived?.disabled).toBe(true);
  });

  it('renders publish state chip inline for non-published battles only', () => {
    render(<BattleFilter />);
    const list = screen.getByTestId('battle-filter-list');
    // Should have chips for draft and review items, not for published ones
    const stateChips = list.querySelectorAll(
      '[data-testid="publish-state-chip"]',
    );
    // draft + review = 2
    expect(stateChips.length).toBe(2);
  });
});
