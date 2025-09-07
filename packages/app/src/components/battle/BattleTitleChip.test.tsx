import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BattleTitleChip } from './BattleTitleChip';

vi.mock('@yonokomae/data-battle-seeds', () => ({
  battleSeedsByFile: {
    'alpha.js': { title: 'Alpha Conflict', themeId: 'tech' },
    'beta.js': { title: 'Beta Encounter', themeId: 'history' },
    'untitled.js': {},
  },
}));

vi.mock('@yonokomae/catalog', () => ({
  battleThemeCatalog: [
    { id: 'tech', name: 'Tech', icon: '💻', description: 'Technology' },
    { id: 'history', name: 'History', icon: '🏺', description: 'History' },
  ],
}));

describe('BattleTitleChip', () => {
  it('renders battle title', () => {
    render(<BattleTitleChip file="alpha.js" />);
    const chip = screen.getByTestId('battle-title-chip');
    expect(chip.textContent).toContain('Alpha Conflict');
  });

  it('falls back to filename if title missing', () => {
    render(<BattleTitleChip file="untitled.js" />);
    expect(screen.getByTestId('battle-title-chip').textContent).toContain(
      'untitled.js',
    );
  });

  it('uses notFoundLabel when file undefined', () => {
    render(<BattleTitleChip file={undefined} notFoundLabel="(none)" />);
    expect(screen.getByTestId('battle-title-chip').textContent).toContain(
      '(none)',
    );
  });

  it('uses custom notFoundLabel if file unknown and fallback disabled', () => {
    render(
      <BattleTitleChip
        file="ghost.js"
        fallbackToFileName={false}
        notFoundLabel="Missing"
      />,
    );
    expect(screen.getByTestId('battle-title-chip').textContent).toBe('Missing');
  });

  it('shows theme icon when showThemeIcon=true and theme present', () => {
    render(<BattleTitleChip file="alpha.js" showThemeIcon />);
    const icon = screen.getByTestId('battle-title-chip-theme-icon');
    expect(icon.textContent).toBe('💻');
  });

  it('does not render icon wrapper when showThemeIcon=false', () => {
    render(<BattleTitleChip file="alpha.js" showThemeIcon={false} />);
    expect(screen.queryByTestId('battle-title-chip-theme-icon')).toBeNull();
  });
});
