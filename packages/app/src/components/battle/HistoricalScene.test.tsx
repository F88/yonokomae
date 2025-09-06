import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HistoricalScene } from './HistoricalScene';
import type { Battle } from '@yonokomae/types';

const makeBattle = (overrides: Partial<Battle> = {}): Battle => ({
  id: 'b1',
  themeId: 'history',
  significance: 'low',
  title: 'T',
  subtitle: 'S',
  narrative: { overview: 'O', scenario: 'N' },
  komae: {
    imageUrl: 'k',
    title: 'K',
    subtitle: 'k',
    description: 'k',
    power: 1,
  },
  yono: {
    imageUrl: 'y',
    title: 'Y',
    subtitle: 'y',
    description: 'y',
    power: 1,
  },
  status: 'success',
  ...overrides,
});

describe('HistoricalScene', () => {
  it('renders provenance list when provided', () => {
    const battle = makeBattle({
      provenance: [
        { label: 'Source A', url: 'http://example.com/a', note: 'Note A' },
        { label: 'Source B' },
      ],
    });
    render(<HistoricalScene battle={battle} />);
    expect(screen.getByText('Sources / Provenance')).toBeInTheDocument();
    expect(screen.getByText('Source A')).toBeInTheDocument();
    expect(screen.getByText(/Note A/)).toBeInTheDocument();
    expect(screen.getByText('Source B')).toBeInTheDocument();
  });

  it('omits provenance section when none given', () => {
    const battle = makeBattle({ provenance: [] });
    render(<HistoricalScene battle={battle} />);
    expect(screen.queryByText('Sources / Provenance')).toBeNull();
  });
});
