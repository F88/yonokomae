import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Scenario } from './Scenario';
import type { Battle } from '@yonokomae/types';

describe('Scenario', () => {
  const mockBattleWithScenario: Battle = {
    id: 'test-battle',
    title: 'Test Battle',
    subtitle: '',
    themeId: 'history',
    significance: 'medium',
    narrative: {
      overview: 'Test overview',
      scenario:
        'This is the detailed scenario that sets up the battle conditions and circumstances.',
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

  const mockBattleWithoutScenario: Battle = {
    id: 'test-battle-2',
    title: 'Test Battle 2',
    subtitle: '',
    themeId: 'culture',
    significance: 'low',
    narrative: {
      overview: 'Test overview',
      scenario: '',
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

  it('renders scenario text when narrative.scenario exists', () => {
    render(<Scenario battle={mockBattleWithScenario} />);

    const scenario = screen.getByTestId('battle-scenario');
    expect(scenario).toBeInTheDocument();
    expect(scenario).toHaveTextContent(
      'This is the detailed scenario that sets up the battle conditions and circumstances.',
    );
  });

  it('returns null when scenario text is empty', () => {
    const { container } = render(
      <Scenario battle={mockBattleWithoutScenario} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('returns null when scenario text is only whitespace', () => {
    const battleWithWhitespace: Battle = {
      ...mockBattleWithScenario,
      narrative: {
        ...mockBattleWithScenario.narrative,
        scenario: '   \n\t   ',
      },
    };

    const { container } = render(<Scenario battle={battleWithWhitespace} />);

    expect(container.firstChild).toBeNull();
  });

  it('returns null when narrative is undefined', () => {
    const battleWithoutNarrative: Battle = {
      ...mockBattleWithScenario,
      narrative: undefined as any,
    };

    const { container } = render(<Scenario battle={battleWithoutNarrative} />);

    expect(container.firstChild).toBeNull();
  });

  it('shows label when showLabel is true', () => {
    render(<Scenario battle={mockBattleWithScenario} showLabel={true} />);

    const label = screen.getByText('Scenario');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass(
      'text-xs',
      'font-semibold',
      'tracking-wide',
      'text-muted-foreground',
    );
  });

  it('does not show label when showLabel is false or undefined', () => {
    render(<Scenario battle={mockBattleWithScenario} showLabel={false} />);

    expect(screen.queryByText('Scenario')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Scenario
        battle={mockBattleWithScenario}
        className="custom-scenario-class"
      />,
    );

    const scenario = screen.getByTestId('battle-scenario');
    expect(scenario).toHaveClass('custom-scenario-class');
  });

  it('has proper default styling', () => {
    render(<Scenario battle={mockBattleWithScenario} />);

    const scenario = screen.getByTestId('battle-scenario');
    expect(scenario).toHaveClass(
      'space-y-1',
      'text-center',
      'max-w-3xl',
      'mx-auto',
    );
    expect(scenario.tagName).toBe('SECTION');
  });

  it('has proper text styling (different from Overview)', () => {
    render(<Scenario battle={mockBattleWithScenario} />);

    const textElement = screen.getByText(
      'This is the detailed scenario that sets up the battle conditions and circumstances.',
    );
    expect(textElement).toHaveClass(
      'text-base',
      'leading-relaxed',
      'text-zinc-700',
      'dark:text-zinc-300',
    );
    expect(textElement.tagName).toBe('P');
  });

  it('combines custom className with default classes', () => {
    render(
      <Scenario
        battle={mockBattleWithScenario}
        className="my-custom-spacing bg-blue-100"
      />,
    );

    const scenario = screen.getByTestId('battle-scenario');
    expect(scenario).toHaveClass('my-custom-spacing', 'bg-blue-100');
    // Should still have default classes
    expect(scenario).toHaveClass(
      'space-y-1',
      'text-center',
      'max-w-3xl',
      'mx-auto',
    );
  });

  it('handles falsy className values correctly', () => {
    render(<Scenario battle={mockBattleWithScenario} className={undefined} />);

    const scenario = screen.getByTestId('battle-scenario');
    expect(scenario).toHaveClass(
      'space-y-1',
      'text-center',
      'max-w-3xl',
      'mx-auto',
    );
  });

  it('renders complete structure with label', () => {
    render(<Scenario battle={mockBattleWithScenario} showLabel={true} />);

    const scenario = screen.getByTestId('battle-scenario');
    const label = screen.getByText('Scenario');
    const text = screen.getByText(
      'This is the detailed scenario that sets up the battle conditions and circumstances.',
    );

    expect(scenario).toContainElement(label);
    expect(scenario).toContainElement(text);
    expect(label.tagName).toBe('H3');
    expect(text.tagName).toBe('P');
  });

  describe('edge cases', () => {
    it('handles null scenario value', () => {
      const battleWithNullScenario: Battle = {
        ...mockBattleWithScenario,
        narrative: {
          ...mockBattleWithScenario.narrative,
          scenario: null as any,
        },
      };

      const { container } = render(
        <Scenario battle={battleWithNullScenario} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('handles non-string scenario value', () => {
      const battleWithNonStringScenario: Battle = {
        ...mockBattleWithScenario,
        narrative: {
          ...mockBattleWithScenario.narrative,
          scenario: 456 as any,
        },
      };

      const { container } = render(
        <Scenario battle={battleWithNonStringScenario} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('trims whitespace from scenario text', () => {
      const battleWithWhitespaceScenario: Battle = {
        ...mockBattleWithScenario,
        narrative: {
          ...mockBattleWithScenario.narrative,
          scenario: '  Valid scenario text with whitespace  ',
        },
      };

      render(<Scenario battle={battleWithWhitespaceScenario} />);

      // Text should be displayed (whitespace doesn't prevent rendering)
      expect(screen.getByTestId('battle-scenario')).toBeInTheDocument();
      expect(
        screen.getByText('Valid scenario text with whitespace'),
      ).toBeInTheDocument();
    });
  });

  describe('comparison with OverView', () => {
    it('has different text color classes than OverView', () => {
      render(<Scenario battle={mockBattleWithScenario} />);

      const textElement = screen.getByText(
        'This is the detailed scenario that sets up the battle conditions and circumstances.',
      );

      // Scenario uses text-zinc-700 dark:text-zinc-300
      expect(textElement).toHaveClass('text-zinc-700', 'dark:text-zinc-300');

      // Verify it doesn't have OverView's classes (text-zinc-900 dark:text-zinc-100)
      expect(textElement).not.toHaveClass(
        'text-zinc-900',
        'dark:text-zinc-100',
      );
    });

    it('uses same structural classes as OverView', () => {
      render(<Scenario battle={mockBattleWithScenario} />);

      const scenario = screen.getByTestId('battle-scenario');

      // Should have same structural classes as OverView
      expect(scenario).toHaveClass(
        'space-y-1',
        'text-center',
        'max-w-3xl',
        'mx-auto',
      );
    });
  });
});
