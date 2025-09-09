/* @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BattleSeedSelector } from './BattleSeedSelector';

// Minimal mock for data-battle-seeds to control dataset
vi.mock('@yonokomae/data-battle-seeds', () => ({
  publishStateKeys: ['published', 'draft', 'review', 'archived'],
  battleSeedsByFile: {
    'a-history.js': {
      title: 'Alpha History',
      themeId: 'history',
      publishState: 'published',
    },
    'b-technology.js': {
      title: 'Beta Tech',
      themeId: 'technology',
      publishState: 'draft',
    },
    'c-history.js': {
      title: 'Gamma History',
      themeId: 'history',
      publishState: 'review',
    },
  },
}));

describe('BattleSeedSelector', () => {
  it('renders nothing when show=false', () => {
    const { container } = render(
      <BattleSeedSelector show={false} value={undefined} onChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('lists all seeds (auto + 3) initially', () => {
    render(<BattleSeedSelector value={undefined} onChange={() => {}} />);
    const select = screen.getByTestId('battle-seed-selector');
    const options = select.querySelectorAll('option');
    // (auto) + 3 seeds
    expect(options.length).toBe(4);
  });

  it('filters by search text (case-insensitive, applies to title and file)', () => {
    render(<BattleSeedSelector value={undefined} onChange={() => {}} />);
    const input = screen.getByTestId(
      'battle-seed-filter-text',
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'beta' } });
    const select = screen.getByTestId('battle-seed-selector');
    const options = Array.from(select.querySelectorAll('option')).map(
      (o) => o.textContent,
    );
    expect(options).toContain('(auto)');
    // Only Beta Tech should remain besides auto
    expect(options).toContain('Beta Tech');
    expect(options).not.toContain('Alpha History');
    expect(options).not.toContain('Gamma History');
  });

  it('filters by themeId', () => {
    render(<BattleSeedSelector value={undefined} onChange={() => {}} />);
    const themeSelect = screen.getByTestId(
      'battle-seed-filter-theme',
    ) as HTMLSelectElement;
    fireEvent.change(themeSelect, { target: { value: 'technology' } });
    const mainSelect = screen.getByTestId('battle-seed-selector');
    const optionTexts = Array.from(mainSelect.querySelectorAll('option')).map(
      (o) => o.textContent,
    );
    expect(optionTexts).toContain('Beta Tech');
    expect(optionTexts).not.toContain('Alpha History');
    expect(optionTexts).not.toContain('Gamma History');
  });

  it('combines search + theme filters', () => {
    render(<BattleSeedSelector value={undefined} onChange={() => {}} />);
    const themeSelect = screen.getByTestId(
      'battle-seed-filter-theme',
    ) as HTMLSelectElement;
    fireEvent.change(themeSelect, { target: { value: 'history' } });
    const searchInput = screen.getByTestId(
      'battle-seed-filter-text',
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Gamma' } });
    const mainSelect = screen.getByTestId('battle-seed-selector');
    const optionTexts = Array.from(mainSelect.querySelectorAll('option')).map(
      (o) => o.textContent,
    );
    expect(optionTexts).toContain('Gamma History');
    expect(optionTexts).not.toContain('Alpha History');
    expect(optionTexts).not.toContain('Beta Tech');
  });

  it('rotate button cycles within filtered set', () => {
    // Use controlled wrapper to update value prop after each onChange
    function Wrapper() {
      const [val, setVal] = useState<string | undefined>(undefined);
      return <BattleSeedSelector value={val} onChange={(v) => setVal(v)} />;
    }
    render(<Wrapper />);
    const themeSelect = screen.getByTestId(
      'battle-seed-filter-theme',
    ) as HTMLSelectElement;
    fireEvent.change(themeSelect, { target: { value: 'history' } });
    const rotateBtn = screen.getByTestId('battle-seed-rotate');
    fireEvent.click(rotateBtn); // first history seed selected
    const firstSelected = (
      screen.getByTestId('battle-seed-selector') as HTMLSelectElement
    ).value;
    fireEvent.click(rotateBtn); // second history seed
    const secondSelected = (
      screen.getByTestId('battle-seed-selector') as HTMLSelectElement
    ).value;
    expect(secondSelected).not.toBe(firstSelected);
  });

  it('clear button appears only when value is set', () => {
    const { rerender } = render(
      <BattleSeedSelector value={undefined} onChange={() => {}} />,
    );
    expect(screen.queryByTestId('battle-seed-clear')).toBeNull();
    rerender(<BattleSeedSelector value={'a-history.js'} onChange={() => {}} />);
    // Basic existence assertion without custom matcher typing
    expect(screen.getByTestId('battle-seed-clear')).toBeTruthy();
  });

  it('filters by publishState only (draft)', () => {
    render(<BattleSeedSelector value={undefined} onChange={() => {}} />);
    const psSelect = screen.getByTestId(
      'battle-seed-filter-publish-state',
    ) as HTMLSelectElement;
    fireEvent.change(psSelect, { target: { value: 'draft' } });
    const mainSelect = screen.getByTestId('battle-seed-selector');
    const optionTexts = Array.from(mainSelect.querySelectorAll('option')).map(
      (o) => o.textContent,
    );
    expect(optionTexts).toContain('Beta Tech');
    expect(optionTexts).not.toContain('Alpha History');
    expect(optionTexts).not.toContain('Gamma History');
  });

  it('combines publishState + theme filters', () => {
    render(<BattleSeedSelector value={undefined} onChange={() => {}} />);
    // Choose history theme first (Alpha published, Gamma review)
    const themeSelect = screen.getByTestId(
      'battle-seed-filter-theme',
    ) as HTMLSelectElement;
    fireEvent.change(themeSelect, { target: { value: 'history' } });
    // Now filter by review publishState (should leave only Gamma)
    const psSelect = screen.getByTestId(
      'battle-seed-filter-publish-state',
    ) as HTMLSelectElement;
    fireEvent.change(psSelect, { target: { value: 'review' } });
    const mainSelect = screen.getByTestId('battle-seed-selector');
    const optionTexts = Array.from(mainSelect.querySelectorAll('option')).map(
      (o) => o.textContent,
    );
    expect(optionTexts).toContain('Gamma History');
    expect(optionTexts).not.toContain('Alpha History');
    expect(optionTexts).not.toContain('Beta Tech');
  });

  it('combines publishState + search filters', () => {
    render(<BattleSeedSelector value={undefined} onChange={() => {}} />);
    const psSelect = screen.getByTestId(
      'battle-seed-filter-publish-state',
    ) as HTMLSelectElement;
    fireEvent.change(psSelect, { target: { value: 'published' } });
    const searchInput = screen.getByTestId(
      'battle-seed-filter-text',
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'alpha' } });
    const mainSelect = screen.getByTestId('battle-seed-selector');
    const optionTexts = Array.from(mainSelect.querySelectorAll('option')).map(
      (o) => o.textContent?.toLowerCase(),
    );
    expect(optionTexts.some((t) => t === 'alpha history')).toBe(true);
    expect(optionTexts.some((t) => t === 'beta tech')).toBe(false);
    expect(optionTexts.some((t) => t === 'gamma history')).toBe(false);
  });
});
