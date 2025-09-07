import { describe, it, expect, vi } from 'vitest';
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BattleSeedSelector } from './BattleSeedSelector';

// Minimal mock for data-battle-seeds to control dataset
vi.mock('@yonokomae/data-battle-seeds', () => ({
  battleSeedsByFile: {
    'a-history.js': { title: 'Alpha History', themeId: 'history' },
    'b-technology.js': { title: 'Beta Tech', themeId: 'technology' },
    'c-history.js': { title: 'Gamma History', themeId: 'history' },
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
});
