import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HistoricalScene } from './HistoricalScene';
import type { Battle } from '@yonokomae/types';

const makeBattle = (overrides: Partial<Battle> = {}): Battle => ({
  id: 'b1',
  themeId: 'history',
  significance: 'low',
  publishState: 'published',
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
  it('renders placeholder when no battle', () => {
    render(<HistoricalScene battle={null} />);
    expect(screen.getAllByTestId('placeholder').length).toBeGreaterThan(0);
  });

  it('sets aria-busy when loading', () => {
    render(<HistoricalScene battle={makeBattle()} isLoading />);
    const container =
      screen.getByRole('article', { hidden: true }) ||
      document.querySelector('.relative.w-full.overflow-hidden');
    expect(container).toBeTruthy();
    expect((container as HTMLElement).getAttribute('aria-busy')).toBe('true');
  });

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

  it('renders scene background for legendary significance (without RM)', () => {
    const legendary = makeBattle({ significance: 'legendary' });
    render(<HistoricalScene battle={legendary} />);
    expect(screen.getByTestId('scene-background-image')).toBeInTheDocument();
  });

  it('shows publish state chip when not published', () => {
    const draft = makeBattle({ publishState: 'review' });
    render(<HistoricalScene battle={draft} />);
    expect(screen.getByText(/review/i)).toBeInTheDocument();
  });

  it('forwards crop banner props to Field', () => {
    const b = makeBattle();
    render(
      <HistoricalScene
        battle={b}
        cropTopBanner
        cropAspectRatio="32/16"
        cropFocusY="y-80"
      />,
    );
    // Assert that Field rendered NetaCard with aspect class through to DOM
    const anyAspect = document.querySelector('.aspect-[32/16]');
    expect(anyAspect).toBeTruthy();
  });
});
