import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MetaData } from '@/components/battle/MetaData';
import { ThemeChip } from '@/components/battle/ThemeChip';
import { BattleContainerIdChip } from '@/components/battle/BattleContainerIdChip';
import type { Battle } from '@yonokomae/types';

// Mock child components that might cause issues
vi.mock('@/components/ui/SignificanceChip', () => ({
  SignificanceChip: ({
    significance,
    variant,
    showLabel,
  }: {
    significance: string;
    variant: string;
    showLabel: boolean;
  }) => {
    return (
      <div
        data-testid="significance-chip"
        data-significance={significance}
        data-variant={variant}
        data-show-label={showLabel}
      >
        Significance: {significance}
      </div>
    );
  },
}));

vi.mock('@/components/battle/BattleScene', () => ({
  BattleScene: ({ battle }: { battle: { id: string; title: string } }) => (
    <div data-testid="battle-scene" data-battle-id={battle.id}>
      Battle Scene: {battle.title}
    </div>
  ),
}));

vi.mock('@/components/battle/HistoricalScene', () => ({
  HistoricalScene: ({ battle }: { battle: { id: string; title: string } }) => (
    <div data-testid="historical-scene" data-battle-id={battle.id}>
      Historical Scene: {battle.title}
    </div>
  ),
}));

describe('Component Integration Tests', () => {
  const user = userEvent.setup();

  const mockBattle: Battle = {
    id: 'integration-test-battle',
    themeId: 'technology',
    significance: 'high',
    publishState: 'published',
    title: 'Integration Test Battle',
    subtitle: 'Testing vs Production',
    narrative: {
      overview: 'A comprehensive integration test',
      scenario: 'Testing component interactions',
    },
    komae: {
      imageUrl: '/test-komae.png',
      title: 'Test Komae',
      subtitle: 'QA Champion',
      description: 'Quality assurance specialist',
      power: 95,
    },
    yono: {
      imageUrl: '/test-yono.png',
      title: 'Test Yono',
      subtitle: 'Dev Master',
      description: 'Development expert',
      power: 90,
    },
    status: 'success',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Battle Metadata Integration', () => {
    it('should render all metadata components together', () => {
      render(<MetaData battle={mockBattle} />);

      expect(screen.getByTestId('battle-metadata')).toBeInTheDocument();
      // ID chip
      expect(screen.getByText('integration-test-battle')).toBeInTheDocument();
      // Theme chip (text still rendered but we focus on presence)
      expect(screen.getAllByTestId('theme-chip').length).toBeGreaterThan(0);
      // Significance chip via data attribute
      const sig = screen.getAllByTestId('significance-chip')[0];
      expect(sig).toHaveAttribute('data-significance', 'high');
      // Publish state chip present
      expect(
        screen.getAllByTestId('publish-state-chip').length,
      ).toBeGreaterThan(0);
    });

    it('should handle different metadata configurations', () => {
      const { rerender } = render(<MetaData battle={mockBattle} compact />);

      expect(screen.getByTestId('battle-metadata')).toBeInTheDocument();

      // Change to non-compact mode
      rerender(<MetaData battle={mockBattle} compact={false} />);

      expect(screen.getByTestId('battle-metadata')).toBeInTheDocument();
    });

    it('should apply alignment correctly across all components', () => {
      const { rerender } = render(
        <MetaData battle={mockBattle} align="center" />,
      );

      const container = screen.getByTestId('battle-metadata');
      expect(container).toHaveClass('text-center');

      rerender(<MetaData battle={mockBattle} align="right" />);
      expect(container).toHaveClass('text-right');
    });
  });

  describe('Theme Integration', () => {
    it('should render theme chip with correct theme data', () => {
      render(<ThemeChip themeId="technology" />);

      expect(screen.getByTestId('theme-chip')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('should handle different theme variants', () => {
      const { rerender } = render(
        <ThemeChip themeId="technology" variant="default" />,
      );

      expect(screen.getByTestId('theme-chip')).toBeInTheDocument();

      rerender(<ThemeChip themeId="technology" variant="outline" />);
      expect(screen.getByTestId('theme-chip')).toBeInTheDocument();
    });

    it('should handle unknown theme gracefully', () => {
      render(
        <ThemeChip themeId={'unknown-theme' as unknown as Battle['themeId']} />,
      );

      expect(screen.getByTestId('theme-chip')).toBeInTheDocument();
      // The component maps unknown themes to history by default
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  describe('Component Composition Integration', () => {
    it('should render multiple components together harmoniously', () => {
      render(
        <div>
          <MetaData battle={mockBattle} />
          <div data-testid="spacer">
            <ThemeChip themeId={mockBattle.themeId} />
            <BattleContainerIdChip battle={mockBattle} />
          </div>
        </div>,
      );

      // All components should render without conflicts
      expect(screen.getByTestId('battle-metadata')).toBeInTheDocument();
      expect(screen.getAllByTestId('theme-chip').length).toBeGreaterThan(0);
      expect(
        screen.getAllByTestId('battle-container-id-chip').length,
      ).toBeGreaterThan(0);
    });
  });

  describe('Interactive Integration', () => {
    it('should handle basic interactions', async () => {
      render(<MetaData battle={mockBattle} />);

      const metadata = screen.getByTestId('battle-metadata');
      expect(metadata).toBeInTheDocument();

      // Test basic hover behavior if applicable
      await user.hover(metadata);
      expect(metadata).toBeInTheDocument();
    });
  });

  describe('Data Consistency Integration', () => {
    it('should maintain data consistency across components', () => {
      render(
        <div>
          <MetaData battle={mockBattle} />
          <BattleContainerIdChip battle={mockBattle} />
          <ThemeChip themeId={mockBattle.themeId} />
        </div>,
      );

      // All components should show consistent data
      expect(
        screen.getAllByText('integration-test-battle').length,
      ).toBeGreaterThan(0);
      expect(screen.getAllByTestId('theme-chip').length).toBeGreaterThan(0);
      const sig = screen.getAllByTestId('significance-chip')[0];
      expect(sig).toHaveAttribute('data-significance', 'high');
      expect(
        screen.getAllByTestId('publish-state-chip').length,
      ).toBeGreaterThan(0);
    });

    it('should handle data updates consistently', () => {
      const updatedBattle = {
        ...mockBattle,
        themeId: 'culture' as const,
        significance: 'medium' as const,
      };

      const { rerender } = render(<MetaData battle={mockBattle} />);

      // initial theme
      expect(screen.getAllByTestId('theme-chip').length).toBeGreaterThan(0);

      rerender(<MetaData battle={updatedBattle} />);

      // updated theme and significance via attributes
      const sig2 = screen.getAllByTestId('significance-chip')[0];
      expect(sig2).toHaveAttribute('data-significance', 'medium');
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain accessibility across integrated components', () => {
      render(<MetaData battle={mockBattle} />);

      const container = screen.getByTestId('battle-metadata');
      expect(container).toBeInTheDocument();

      // Components should have proper accessibility attributes
      expect(container).toHaveClass('space-y-1');
    });

    it('should support basic accessibility features', async () => {
      render(
        <div>
          <ThemeChip themeId={mockBattle.themeId} />
          <BattleContainerIdChip battle={mockBattle} />
        </div>,
      );

      // Should have aria-labels
      expect(screen.getByLabelText(/Theme Technology/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Battle ID/)).toBeInTheDocument();
    });
  });

  describe('Error Boundary Integration', () => {
    it('should handle component errors gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Create a battle that might cause issues
  const problematicBattle = {
    ...mockBattle,
    id: undefined as unknown,
  } as unknown as Battle;

  render(<MetaData battle={problematicBattle} />);

      // Component should either render with fallbacks or be caught by error boundary
      expect(screen.getByTestId('battle-metadata')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Performance Integration', () => {
    it('should render multiple components efficiently', async () => {
      const startTime = performance.now();

      render(
        <div>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i}>
              <MetaData battle={{ ...mockBattle, id: `battle-${i}` }} />
            </div>
          ))}
        </div>,
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render reasonably quickly (less than 1000ms)
      expect(renderTime).toBeLessThan(1000);

      // All components should be rendered
      expect(screen.getAllByTestId('battle-metadata')).toHaveLength(5);
    });
  });
});
