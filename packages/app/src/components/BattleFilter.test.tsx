import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BattleFilter } from './BattleFilter';

vi.mock('@yonokomae/data-battle-seeds', () => ({
  battleSeedsByFile: {
    'a-history.js': { title: 'Alpha History', themeId: 'history' },
    'b-tech.js': { title: 'Beta Tech', themeId: 'technology' },
    'c-history.js': { title: 'Gamma History', themeId: 'history' },
    'd-culture.js': { title: 'Delta Culture', themeId: 'culture' },
  },
}));

describe('BattleFilter (chip single-select)', () => {
  it('renders wrapper and all chip active by default', () => {
    render(<BattleFilter />);
    expect(screen.getByTestId('battle-filter-wrapper')).toBeTruthy();
    const allChip = screen.getByTestId('battle-filter-chip-all');
    expect(allChip.getAttribute('data-selected')).toBe('true');
    // Battle list should be hidden while in "All" mode
    expect(screen.queryByTestId('battle-filter-list')).toBeNull();
  });

  it('selecting a theme shows filtered list; returning to All hides list', () => {
    render(<BattleFilter />);
    // Initially no list
    expect(screen.queryByTestId('battle-filter-list')).toBeNull();
    const historyChip = screen.getByTestId('battle-filter-chip-history');
    fireEvent.click(historyChip);
    const list = screen.getByTestId('battle-filter-list');
    expect(list.textContent).toContain('Alpha History');
    expect(list.textContent).toContain('Gamma History');
    expect(list.textContent).not.toContain('Beta Tech');
    // Back to All should remove list entirely
    fireEvent.click(screen.getByTestId('battle-filter-chip-all'));
    expect(screen.queryByTestId('battle-filter-list')).toBeNull();
  });

  it('themeIdsFilter restricts universe (technology only)', () => {
    render(<BattleFilter themeIdsFilter={['technology']} />);
    // Initially All => no list
    expect(screen.queryByTestId('battle-filter-list')).toBeNull();
    const techChip = screen.getByTestId('battle-filter-chip-technology');
    fireEvent.click(techChip);
    const list = screen.getByTestId('battle-filter-list');
    expect(list.textContent).toContain('Beta Tech');
    expect(list.textContent).not.toContain('Alpha History');
    expect(screen.queryByTestId('battle-filter-chip-history')).toBeNull();
  });

});
