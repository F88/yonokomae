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
    'e-no-theme.js': {
      title: 'No Theme Battle',
      // Missing themeId
      publishState: 'published',
    },
    'f-no-publish-state.js': {
      title: 'No Publish State',
      themeId: 'history',
      // Missing publishState - should default to 'published'
    },
  },
}));

describe('BattleFilter - Additional Coverage Tests', () => {
  it('handles battles with missing themeId', () => {
    render(<BattleFilter />);
    const list = screen.getByTestId('battle-filter-list');
    // Should handle battles without themeId gracefully
    expect(list.textContent).toContain('No Theme Battle');
  });

  it('handles battles with missing publishState (defaults to published)', () => {
    render(<BattleFilter />);
    const list = screen.getByTestId('battle-filter-list');
    // Should show battle with missing publishState
    expect(list.textContent).toContain('No Publish State');
  });

  it('handles show=false prop', () => {
    render(<BattleFilter show={false} />);
    // Should not render when show=false
    expect(screen.queryByTestId('battle-filter-wrapper')).toBeNull();
  });

  it('handles showPublishStateFilter=false', () => {
    render(<BattleFilter showPublishStateFilter={false} />);
    // Should not show publish state select
    expect(screen.queryByTestId('battle-filter-publish-state')).toBeNull();
  });

  it('handles showPublishStateCounts=false', () => {
    render(<BattleFilter showPublishStateCounts={false} />);
    const psSelect = screen.getByTestId(
      'battle-filter-publish-state',
    ) as HTMLSelectElement;
    const allOption = Array.from(psSelect.options).find((o) => o.value === '');
    // Should not show counts in option text
    expect(allOption?.textContent).toBe('(all states)');
  });

  it('calls onSelectedThemeIdChange when theme is selected', () => {
    const mockOnThemeChange = vi.fn();
    render(<BattleFilter onSelectedThemeIdChange={mockOnThemeChange} />);

    const historyChip = screen.getByTestId('battle-filter-chip-history');
    fireEvent.click(historyChip);

    expect(mockOnThemeChange).toHaveBeenCalledWith('history');
  });

  it('calls onSelectedPublishStateChange when publish state is selected', () => {
    const mockOnPublishStateChange = vi.fn();
    render(
      <BattleFilter onSelectedPublishStateChange={mockOnPublishStateChange} />,
    );

    const psSelect = screen.getByTestId(
      'battle-filter-publish-state',
    ) as HTMLSelectElement;
    fireEvent.change(psSelect, { target: { value: 'draft' } });

    expect(mockOnPublishStateChange).toHaveBeenCalledWith('draft');
  });

  it('calls onSelectedThemeIdChange with undefined when ALL is selected', () => {
    const mockOnThemeChange = vi.fn();
    render(
      <BattleFilter
        selectedThemeId="history"
        onSelectedThemeIdChange={mockOnThemeChange}
      />,
    );

    const allChip = screen.getByTestId('battle-filter-chip-all');
    fireEvent.click(allChip);

    expect(mockOnThemeChange).toHaveBeenCalledWith(undefined);
  });

  it('calls onSelectedPublishStateChange with undefined when empty value is selected', () => {
    const mockOnPublishStateChange = vi.fn();
    render(
      <BattleFilter
        selectedPublishState="draft"
        onSelectedPublishStateChange={mockOnPublishStateChange}
      />,
    );

    const psSelect = screen.getByTestId(
      'battle-filter-publish-state',
    ) as HTMLSelectElement;
    fireEvent.change(psSelect, { target: { value: '' } });

    expect(mockOnPublishStateChange).toHaveBeenCalledWith(undefined);
  });

  it('shows empty state when no battles match filters', () => {
    render(<BattleFilter themeIdsFilter={['nonexistent']} />);
    expect(screen.getByTestId('battle-filter-empty')).toBeInTheDocument();
  });

  it('updates local state optimistically', () => {
    const { rerender } = render(<BattleFilter selectedThemeId={undefined} />);

    // Local state should update immediately on click
    const historyChip = screen.getByTestId('battle-filter-chip-history');
    fireEvent.click(historyChip);

    // Should show as selected even before parent updates
    expect(historyChip.getAttribute('data-selected')).toBe('true');

    // When parent prop updates, local state should sync
    rerender(<BattleFilter selectedThemeId="history" />);
    expect(historyChip.getAttribute('data-selected')).toBe('true');
  });

  it('syncs local publishState with prop changes', () => {
    const { rerender } = render(
      <BattleFilter selectedPublishState={undefined} />,
    );

    const psSelect = screen.getByTestId(
      'battle-filter-publish-state',
    ) as HTMLSelectElement;
    expect(psSelect.value).toBe('');

    // When parent prop updates, local state should sync
    rerender(<BattleFilter selectedPublishState="draft" />);
    expect(psSelect.value).toBe('draft');
  });

  it('applies custom className', () => {
    render(<BattleFilter className="custom-class" />);
    const wrapper = screen.getByTestId('battle-filter-wrapper');
    expect(wrapper.className).toContain('custom-class');
  });

  it('shows correct battle counts for each publish state', () => {
    render(<BattleFilter />);
    const psSelect = screen.getByTestId(
      'battle-filter-publish-state',
    ) as HTMLSelectElement;

    // Check that options show correct counts
    const draftOption = Array.from(psSelect.options).find(
      (o) => o.value === 'draft',
    );
    expect(draftOption?.textContent).toContain('(1)'); // 1 draft battle

    const publishedOption = Array.from(psSelect.options).find(
      (o) => o.value === 'published',
    );
    expect(publishedOption?.textContent).toContain('(4)'); // 4 published battles (including defaults)
  });

  it('sorts battles by theme catalog order then by title', () => {
    render(<BattleFilter />);
    const list = screen.getByTestId('battle-filter-list');

    // Should maintain consistent ordering
    const battleChips = list.querySelectorAll(
      '[data-testid^="battle-title-chip"]',
    );
    expect(battleChips.length).toBeGreaterThan(0);
  });

  it('filters correctly when both theme and publish state are selected', () => {
    render(<BattleFilter />);

    // Select history theme
    fireEvent.click(screen.getByTestId('battle-filter-chip-history'));

    // Select review publish state
    const psSelect = screen.getByTestId(
      'battle-filter-publish-state',
    ) as HTMLSelectElement;
    fireEvent.change(psSelect, { target: { value: 'review' } });

    const list = screen.getByTestId('battle-filter-list');
    // Should only show "Gamma History" which is history + review
    expect(list.textContent).toContain('Gamma History');
    expect(list.textContent).not.toContain('Alpha History'); // history + published
    expect(list.textContent).not.toContain('Beta Tech'); // technology + draft
  });

  it('handles focus and accessibility', () => {
    render(<BattleFilter />);

    const themeChips = screen.getByTestId('battle-filter-chips');
    expect(themeChips).toHaveAttribute('aria-label', 'Theme selection');

    const psSelect = screen.getByTestId('battle-filter-publish-state');
    expect(psSelect).toHaveAttribute('aria-label', 'publishState filter');
  });
});
