import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OverView } from './OverView';
import type { Battle } from '@yonokomae/types';

describe('OverView', () => {
  const mockBattleWithOverview: Battle = {
    id: 'test-battle',
    publishState: 'published',
    title: 'Test Battle',
    subtitle: '',
    themeId: 'history',
    significance: 'medium',
    narrative: {
      overview:
        'This is a comprehensive overview of the battle that explains the context and background.',
      scenario: 'Test scenario',
    },
    yono: {
      title: 'YONO',
      subtitle: 'subtitle',
      description: 'desc',
      power: 100,
      imageUrl: '',
    },
    komae: {
      title: 'KOMAE',
      subtitle: 'subtitle',
      description: 'desc',
      power: 90,
      imageUrl: '',
    },
    status: 'success',
  };

  const mockBattleWithoutOverview: Battle = {
    id: 'test-battle-2',
    publishState: 'published',
    title: 'Test Battle 2',
    subtitle: '',
    themeId: 'culture',
    significance: 'low',
    narrative: {
      overview: '',
      scenario: 'Test scenario',
    },
    yono: {
      title: 'YONO',
      subtitle: 'subtitle',
      description: 'desc',
      power: 80,
      imageUrl: '',
    },
    komae: {
      title: 'KOMAE',
      subtitle: 'subtitle',
      description: 'desc',
      power: 85,
      imageUrl: '',
    },
    status: 'success',
  };

  it('renders overview text when narrative.overview exists', () => {
    render(<OverView battle={mockBattleWithOverview} />);

    const overview = screen.getByTestId('battle-overview');
    expect(overview).toBeInTheDocument();
    expect(overview).toHaveTextContent(
      'This is a comprehensive overview of the battle that explains the context and background.',
    );
  });

  it('returns null when overview text is empty', () => {
    const { container } = render(
      <OverView battle={mockBattleWithoutOverview} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('returns null when overview text is only whitespace', () => {
    const battleWithWhitespace: Battle = {
      ...mockBattleWithOverview,
      narrative: {
        ...mockBattleWithOverview.narrative,
        overview: '   \n\t   ',
      },
    };

    const { container } = render(<OverView battle={battleWithWhitespace} />);

    expect(container.firstChild).toBeNull();
  });

  it('returns null when narrative is undefined', () => {
    const battleWithoutNarrative: Battle = {
      ...mockBattleWithOverview,
      narrative: undefined as unknown as Battle['narrative'],
    };

    const { container } = render(<OverView battle={battleWithoutNarrative} />);

    expect(container.firstChild).toBeNull();
  });

  it('shows label when showLabel is true', () => {
    render(<OverView battle={mockBattleWithOverview} showLabel={true} />);

    const label = screen.getByText('Overview');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass(
      'text-xs',
      'font-semibold',
      'tracking-wide',
      'text-muted-foreground',
    );
  });

  it('does not show label when showLabel is false or undefined', () => {
    render(<OverView battle={mockBattleWithOverview} showLabel={false} />);

    expect(screen.queryByText('Overview')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <OverView
        battle={mockBattleWithOverview}
        className="custom-overview-class"
      />,
    );

    const overview = screen.getByTestId('battle-overview');
    expect(overview).toHaveClass('custom-overview-class');
  });

  it('has proper default styling', () => {
    render(<OverView battle={mockBattleWithOverview} />);

    const overview = screen.getByTestId('battle-overview');
    expect(overview).toHaveClass(
      'space-y-1',
      'text-center',
      'max-w-3xl',
      'mx-auto',
    );
    expect(overview.tagName).toBe('SECTION');
  });

  it('has proper text styling', () => {
    render(<OverView battle={mockBattleWithOverview} />);

    const textElement = screen.getByText(
      'This is a comprehensive overview of the battle that explains the context and background.',
    );
    expect(textElement).toHaveClass(
      'text-base',
      'leading-relaxed',
      'text-zinc-900',
      'dark:text-zinc-100',
    );
    expect(textElement.tagName).toBe('P');
  });

  it('combines custom className with default classes', () => {
    render(
      <OverView
        battle={mockBattleWithOverview}
        className="my-custom-spacing bg-red-100"
      />,
    );

    const overview = screen.getByTestId('battle-overview');
    expect(overview).toHaveClass('my-custom-spacing', 'bg-red-100');
    // Should still have default classes
    expect(overview).toHaveClass(
      'space-y-1',
      'text-center',
      'max-w-3xl',
      'mx-auto',
    );
  });

  it('handles falsy className values correctly', () => {
    render(<OverView battle={mockBattleWithOverview} className={undefined} />);

    const overview = screen.getByTestId('battle-overview');
    expect(overview).toHaveClass(
      'space-y-1',
      'text-center',
      'max-w-3xl',
      'mx-auto',
    );
  });

  it('renders complete structure with label', () => {
    render(<OverView battle={mockBattleWithOverview} showLabel={true} />);

    const overview = screen.getByTestId('battle-overview');
    const label = screen.getByText('Overview');
    const text = screen.getByText(
      'This is a comprehensive overview of the battle that explains the context and background.',
    );

    expect(overview).toContainElement(label);
    expect(overview).toContainElement(text);
    expect(label.tagName).toBe('H3');
    expect(text.tagName).toBe('P');
  });

  describe('edge cases', () => {
    it('handles null overview value', () => {
    const battleWithNullOverview: Battle = {
      ...mockBattleWithOverview,
      narrative: {
        ...mockBattleWithOverview.narrative,
        overview: null as unknown as string,
      },
    };

      const { container } = render(
        <OverView battle={battleWithNullOverview} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('handles non-string overview value', () => {
    const battleWithNonStringOverview: Battle = {
      ...mockBattleWithOverview,
      narrative: {
        ...mockBattleWithOverview.narrative,
        overview: 123 as unknown as string,
      },
    };

      const { container } = render(
        <OverView battle={battleWithNonStringOverview} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('trims whitespace from overview text', () => {
      const battleWithWhitespaceOverview: Battle = {
        ...mockBattleWithOverview,
        narrative: {
          ...mockBattleWithOverview.narrative,
          overview: '  Valid overview text with whitespace  ',
        },
      };

      render(<OverView battle={battleWithWhitespaceOverview} />);

      // Text should be displayed (whitespace doesn't prevent rendering)
      expect(screen.getByTestId('battle-overview')).toBeInTheDocument();
      expect(
        screen.getByText('Valid overview text with whitespace'),
      ).toBeInTheDocument();
    });
  });
});
