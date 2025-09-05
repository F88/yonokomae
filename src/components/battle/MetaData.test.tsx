import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetaData } from './MetaData';
import type { Battle } from '@yonokomae/types';

// Mock child components
vi.mock('./ThemeChip', () => ({
  ThemeChip: ({ themeId, variant }: { themeId: string; variant: string }) => (
    <div data-testid="theme-chip" data-theme={themeId} data-variant={variant}>
      Theme: {themeId}
    </div>
  ),
}));

vi.mock('./BattleContainerIdChip', () => ({
  BattleContainerIdChip: ({
    battle,
    variant,
  }: {
    battle: { id: string };
    variant: string;
  }) => (
    <div
      data-testid="battle-id-chip"
      data-battle-id={battle.id}
      data-variant={variant}
    >
      Battle: {battle.id}
    </div>
  ),
}));

vi.mock('@/components/ui/significance-chip', () => ({
  SignificanceChip: ({
    significance,
    variant,
    showLabel,
  }: {
    significance: string;
    variant: string;
    showLabel: boolean;
  }) => (
    <div
      data-testid="significance-chip"
      data-significance={significance}
      data-variant={variant}
      data-show-label={showLabel}
    >
      Significance: {significance}
    </div>
  ),
}));

describe('MetaData', () => {
  const mockBattle: Battle = {
    id: 'test-battle',
    themeId: 'tech',
    significance: 'medium',
    title: 'Test Battle',
    subtitle: 'Test vs Test',
    narrative: {
      overview: 'Test overview',
      scenario: 'Test scenario',
    },
    komae: {
      imageUrl: '/test-komae.png',
      title: 'Komae',
      subtitle: 'Test Subtitle',
      description: 'Test description',
      power: 100,
    },
    yono: {
      imageUrl: '/test-yono.png',
      title: 'Yono',
      subtitle: 'Test Subtitle',
      description: 'Test description',
      power: 100,
    },
    status: 'success',
  };

  describe('Basic Rendering', () => {
    it('should render all metadata components', () => {
      render(<MetaData battle={mockBattle} />);

      expect(screen.getByTestId('battle-metadata')).toBeInTheDocument();
      expect(screen.getByTestId('battle-id-chip')).toBeInTheDocument();
      expect(screen.getByTestId('theme-chip')).toBeInTheDocument();
      expect(screen.getByTestId('significance-chip')).toBeInTheDocument();
    });

    it('should pass correct props to child components', () => {
      render(<MetaData battle={mockBattle} />);

      const battleChip = screen.getByTestId('battle-id-chip');
      expect(battleChip).toHaveAttribute('data-battle-id', 'test-battle');
      expect(battleChip).toHaveAttribute('data-variant', 'outline');

      const themeChip = screen.getByTestId('theme-chip');
      expect(themeChip).toHaveAttribute('data-theme', 'tech');
      expect(themeChip).toHaveAttribute('data-variant', 'secondary');

      const significanceChip = screen.getByTestId('significance-chip');
      expect(significanceChip).toHaveAttribute('data-significance', 'medium');
      expect(significanceChip).toHaveAttribute('data-variant', 'secondary');
      expect(significanceChip).toHaveAttribute('data-show-label', 'true');
    });

    it('should render battle content text', () => {
      render(<MetaData battle={mockBattle} />);

      expect(screen.getByText('Battle: test-battle')).toBeInTheDocument();
      expect(screen.getByText('Theme: tech')).toBeInTheDocument();
      expect(screen.getByText('Significance: medium')).toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('should use outline variants when compact is true', () => {
      render(<MetaData battle={mockBattle} compact={true} />);

      const themeChip = screen.getByTestId('theme-chip');
      expect(themeChip).toHaveAttribute('data-variant', 'outline');

      const significanceChip = screen.getByTestId('significance-chip');
      expect(significanceChip).toHaveAttribute('data-variant', 'outline');
    });

    it('should use secondary variants when compact is false', () => {
      render(<MetaData battle={mockBattle} compact={false} />);

      const themeChip = screen.getByTestId('theme-chip');
      expect(themeChip).toHaveAttribute('data-variant', 'secondary');

      const significanceChip = screen.getByTestId('significance-chip');
      expect(significanceChip).toHaveAttribute('data-variant', 'secondary');
    });

    it('should use secondary variants by default', () => {
      render(<MetaData battle={mockBattle} />);

      const themeChip = screen.getByTestId('theme-chip');
      expect(themeChip).toHaveAttribute('data-variant', 'secondary');

      const significanceChip = screen.getByTestId('significance-chip');
      expect(significanceChip).toHaveAttribute('data-variant', 'secondary');
    });
  });

  describe('Alignment', () => {
    it('should apply left alignment by default', () => {
      render(<MetaData battle={mockBattle} />);

      const container = screen.getByTestId('battle-metadata');
      expect(container).toHaveClass('text-left');

      const itemContainer = container.querySelector('.flex');
      expect(itemContainer).toHaveClass('justify-start');
    });

    it('should apply center alignment when specified', () => {
      render(<MetaData battle={mockBattle} align="center" />);

      const container = screen.getByTestId('battle-metadata');
      expect(container).toHaveClass('text-center');

      const itemContainer = container.querySelector('.flex');
      expect(itemContainer).toHaveClass('justify-center');
    });

    it('should apply right alignment when specified', () => {
      render(<MetaData battle={mockBattle} align="right" />);

      const container = screen.getByTestId('battle-metadata');
      expect(container).toHaveClass('text-right');

      const itemContainer = container.querySelector('.flex');
      expect(itemContainer).toHaveClass('justify-end');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const customClass = 'custom-metadata-class';
      render(<MetaData battle={mockBattle} className={customClass} />);

      const container = screen.getByTestId('battle-metadata');
      expect(container).toHaveClass(customClass);
    });

    it('should maintain base classes with custom className', () => {
      render(<MetaData battle={mockBattle} className="custom-class" />);

      const container = screen.getByTestId('battle-metadata');
      expect(container).toHaveClass('space-y-1', 'text-left', 'custom-class');
    });
  });

  describe('CSS Class Application', () => {
    it('should apply correct base classes', () => {
      render(<MetaData battle={mockBattle} />);

      const container = screen.getByTestId('battle-metadata');
      expect(container).toHaveClass('space-y-1');

      const itemContainer = container.querySelector('.flex');
      expect(itemContainer).toHaveClass('flex', 'items-center', 'gap-2');
    });

    it('should include py-0.5 class when not compact', () => {
      render(<MetaData battle={mockBattle} compact={false} />);

      const itemContainer = screen
        .getByTestId('battle-metadata')
        .querySelector('.flex');
      expect(itemContainer?.className).toContain('py-0.5');
    });

    it('should exclude py-0.5 class when compact', () => {
      render(<MetaData battle={mockBattle} compact={true} />);

      const itemContainer = screen
        .getByTestId('battle-metadata')
        .querySelector('.flex');
      expect(itemContainer?.className).not.toContain('py-0.5');
    });
  });

  describe('Props Validation', () => {
    it('should handle different battle data', () => {
      const differentBattle: Battle = {
        ...mockBattle,
        id: 'different-battle',
        themeId: 'culture',
        significance: 'high',
      };

      render(<MetaData battle={differentBattle} />);

      const battleChip = screen.getByTestId('battle-id-chip');
      expect(battleChip).toHaveAttribute('data-battle-id', 'different-battle');

      const themeChip = screen.getByTestId('theme-chip');
      expect(themeChip).toHaveAttribute('data-theme', 'culture');

      const significanceChip = screen.getByTestId('significance-chip');
      expect(significanceChip).toHaveAttribute('data-significance', 'high');
    });

    it('should handle all alignment options', () => {
      const alignments: Array<'left' | 'center' | 'right'> = [
        'left',
        'center',
        'right',
      ];

      alignments.forEach((alignment) => {
        const { unmount } = render(
          <MetaData battle={mockBattle} align={alignment} />,
        );

        const container = screen.getByTestId('battle-metadata');
        expect(container).toHaveClass(`text-${alignment}`);

        const expectedJustify =
          alignment === 'left'
            ? 'justify-start'
            : alignment === 'center'
              ? 'justify-center'
              : 'justify-end';

        const itemContainer = container.querySelector('.flex');
        expect(itemContainer).toHaveClass(expectedJustify);

        unmount();
      });
    });

    it('should handle boolean compact values', () => {
      const { rerender } = render(
        <MetaData battle={mockBattle} compact={true} />,
      );

      let themeChip = screen.getByTestId('theme-chip');
      expect(themeChip).toHaveAttribute('data-variant', 'outline');

      rerender(<MetaData battle={mockBattle} compact={false} />);

      themeChip = screen.getByTestId('theme-chip');
      expect(themeChip).toHaveAttribute('data-variant', 'secondary');
    });
  });

  describe('Data Test IDs', () => {
    it('should have data-testid for testing', () => {
      render(<MetaData battle={mockBattle} />);

      expect(screen.getByTestId('battle-metadata')).toBeInTheDocument();
    });
  });

  describe('Component Composition', () => {
    it('should render components in correct order', () => {
      render(<MetaData battle={mockBattle} />);

      const container = screen.getByTestId('battle-metadata');
      const chipContainer = container.querySelector('.flex');
      const childChips = chipContainer?.querySelectorAll('[data-testid]');

      // Should have 3 child chips
      expect(childChips).toHaveLength(3);

      expect(childChips?.[0]).toHaveAttribute('data-testid', 'battle-id-chip');
      expect(childChips?.[1]).toHaveAttribute('data-testid', 'theme-chip');
      expect(childChips?.[2]).toHaveAttribute(
        'data-testid',
        'significance-chip',
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined optional props gracefully', () => {
      render(<MetaData battle={mockBattle} className={undefined} />);

      const container = screen.getByTestId('battle-metadata');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('space-y-1', 'text-left');
    });

    it('should handle falsy className values', () => {
      render(<MetaData battle={mockBattle} className="" />);

      const container = screen.getByTestId('battle-metadata');
      expect(container).toHaveClass('space-y-1', 'text-left');
    });
  });
});
