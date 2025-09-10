import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BattleContainerIdChip } from './BattleContainerIdChip';
import type { Battle } from '@yonokomae/types';

describe('BattleContainerIdChip', () => {
  const mockBattle: Battle = {
    id: 'test-battle-id',
    themeId: 'technology',
    publishState: 'published',
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
    it('should render battle ID chip with correct content', () => {
      render(<BattleContainerIdChip battle={mockBattle} />);

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toBeInTheDocument();
      expect(screen.getByText('test-battle-id')).toBeInTheDocument();
      expect(screen.getByText('🏷️')).toBeInTheDocument();
    });

    it('should have correct aria attributes', () => {
      render(<BattleContainerIdChip battle={mockBattle} />);

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toHaveAttribute('aria-label', 'Battle ID test-battle-id');
      expect(chip).toHaveAttribute('title', 'test-battle-id');
    });

    it('should mark emoji as aria-hidden', () => {
      render(<BattleContainerIdChip battle={mockBattle} />);

      const emoji = screen.getByText('🏷️');
      expect(emoji).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Variants', () => {
    it('should use outline variant by default', () => {
      render(<BattleContainerIdChip battle={mockBattle} />);

      const chip = screen.getByTestId('battle-container-id-chip');
      // Badge component should receive the variant prop
      expect(chip).toBeInTheDocument();
    });

    it('should accept default variant', () => {
      render(<BattleContainerIdChip battle={mockBattle} variant="default" />);

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toBeInTheDocument();
    });

    it('should accept secondary variant', () => {
      render(<BattleContainerIdChip battle={mockBattle} variant="secondary" />);

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toBeInTheDocument();
    });

    it('should accept outline variant explicitly', () => {
      render(<BattleContainerIdChip battle={mockBattle} variant="outline" />);

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct base CSS classes', () => {
      render(<BattleContainerIdChip battle={mockBattle} />);

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toHaveClass(
        'px-1.5',
        'py-0.5',
        'font-mono',
        'tracking-tight',
        'inline-flex',
        'items-center',
        'gap-1',
      );
    });

    it('should have responsive text sizing', () => {
      render(<BattleContainerIdChip battle={mockBattle} />);

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip.className).toContain('text-[10px]');
      expect(chip.className).toContain('sm:text-xs');
    });

    it('should apply custom className', () => {
      const customClass = 'custom-battle-chip';
      render(
        <BattleContainerIdChip battle={mockBattle} className={customClass} />,
      );

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toHaveClass(customClass);
    });

    it('should maintain base classes with custom className', () => {
      render(
        <BattleContainerIdChip battle={mockBattle} className="custom-class" />,
      );

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toHaveClass('px-1.5', 'py-0.5', 'font-mono', 'custom-class');
    });
  });

  describe('Battle ID Display', () => {
    it('should display different battle IDs correctly', () => {
      const battleWithLongId = {
        ...mockBattle,
        id: 'very-long-battle-identifier-with-many-words',
      };

      render(<BattleContainerIdChip battle={battleWithLongId} />);

      expect(
        screen.getByText('very-long-battle-identifier-with-many-words'),
      ).toBeInTheDocument();

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toHaveAttribute(
        'title',
        'very-long-battle-identifier-with-many-words',
      );
      expect(chip).toHaveAttribute(
        'aria-label',
        'Battle ID very-long-battle-identifier-with-many-words',
      );
    });

    it('should handle short battle IDs', () => {
      const battleWithShortId = {
        ...mockBattle,
        id: 'ab',
      };

      render(<BattleContainerIdChip battle={battleWithShortId} />);

      expect(screen.getByText('ab')).toBeInTheDocument();

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toHaveAttribute('title', 'ab');
      expect(chip).toHaveAttribute('aria-label', 'Battle ID ab');
    });

    it('should handle battle IDs with special characters', () => {
      const battleWithSpecialId = {
        ...mockBattle,
        id: 'battle-2024_test-v1.0',
      };

      render(<BattleContainerIdChip battle={battleWithSpecialId} />);

      expect(screen.getByText('battle-2024_test-v1.0')).toBeInTheDocument();

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toHaveAttribute('title', 'battle-2024_test-v1.0');
    });
  });

  describe('Component Structure', () => {
    it('should render emoji and text as separate spans', () => {
      render(<BattleContainerIdChip battle={mockBattle} />);

      const chip = screen.getByTestId('battle-container-id-chip');
      const spans = chip.querySelectorAll('span');

      expect(spans).toHaveLength(2);
      expect(spans[0]).toHaveTextContent('🏷️');
      expect(spans[0]).toHaveAttribute('aria-hidden', 'true');
      expect(spans[1]).toHaveTextContent('test-battle-id');
    });

    it('should have emoji span first, then text span', () => {
      render(<BattleContainerIdChip battle={mockBattle} />);

      const chip = screen.getByTestId('battle-container-id-chip');
      const spans = chip.querySelectorAll('span');

      expect(spans[0]).toHaveTextContent('🏷️');
      expect(spans[1]).toHaveTextContent('test-battle-id');
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessible name', () => {
      render(<BattleContainerIdChip battle={mockBattle} />);

      const chip = screen.getByLabelText('Battle ID test-battle-id');
      expect(chip).toBeInTheDocument();
    });

    it('should provide tooltip with battle ID', () => {
      render(<BattleContainerIdChip battle={mockBattle} />);

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toHaveAttribute('title', 'test-battle-id');
    });

    it('should hide decorative emoji from screen readers', () => {
      render(<BattleContainerIdChip battle={mockBattle} />);

      const emoji = screen.getByText('🏷️');
      expect(emoji).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Props Validation', () => {
    it('should accept all valid variant values', () => {
      const variants: Array<'default' | 'secondary' | 'outline'> = [
        'default',
        'secondary',
        'outline',
      ];

      variants.forEach((variant) => {
        const { unmount } = render(
          <BattleContainerIdChip battle={mockBattle} variant={variant} />,
        );

        const chip = screen.getByTestId('battle-container-id-chip');
        expect(chip).toBeInTheDocument();

        unmount();
      });
    });

    it('should handle undefined className gracefully', () => {
      render(
        <BattleContainerIdChip battle={mockBattle} className={undefined} />,
      );

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toHaveClass('px-1.5', 'py-0.5');
    });

    it('should handle empty string className', () => {
      render(<BattleContainerIdChip battle={mockBattle} className="" />);

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toHaveClass('px-1.5', 'py-0.5');
    });
  });

  describe('Different Battle Objects', () => {
    it('should work with minimal battle object', () => {
      const minimalBattle: Battle = {
        id: 'minimal',
        themeId: 'technology',
        significance: 'low',
        publishState: 'published',
        title: 'Minimal',
        subtitle: 'Test',
        narrative: { overview: 'test', scenario: 'test' },
        komae: {
          imageUrl: '',
          title: '',
          subtitle: '',
          description: '',
          power: 0,
        },
        yono: {
          imageUrl: '',
          title: '',
          subtitle: '',
          description: '',
          power: 0,
        },
        status: 'success',
      };

      render(<BattleContainerIdChip battle={minimalBattle} />);

      expect(screen.getByText('minimal')).toBeInTheDocument();

      const chip = screen.getByTestId('battle-container-id-chip');
      expect(chip).toHaveAttribute('aria-label', 'Battle ID minimal');
      expect(chip).toHaveAttribute('title', 'minimal');
    });
  });

  describe('CSS Class Utility Function', () => {
    it('should filter out falsy values in className construction', () => {
      render(
        <BattleContainerIdChip battle={mockBattle} className={undefined} />,
      );

      const chip = screen.getByTestId('battle-container-id-chip');
      // Should not have 'undefined' as a class
      expect(chip.className).not.toContain('undefined');
    });
  });
});
