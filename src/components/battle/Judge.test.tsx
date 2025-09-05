import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JudgeCard } from './Judge';
import * as UseJudgement from '@/hooks/use-judgement';
import * as ReducedMotion from '@/lib/reduced-motion';
import type { Battle } from '@yonokomae/types';
import type { PlayMode } from '@/yk/play-mode';

// Mock the dependencies
vi.mock('@/hooks/use-judgement', () => ({
  useJudgement: vi.fn(),
}));

vi.mock('@/lib/reduced-motion', () => ({
  prefersReducedMotion: vi.fn(() => false),
}));

// Mock Math.random for deterministic tests
const mockRandom = vi.fn();
Object.defineProperty(global.Math, 'random', {
  value: mockRandom,
  writable: true,
});

describe('Judge Components', () => {
  const mockBattle: Battle = {
    id: 'test-battle',
    themeId: 'history',
    significance: 'high',
    title: 'Test Battle',
    subtitle: 'subtitle',
    narrative: {
      overview: 'overview',
      scenario: 'scenario',
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
  };

  const mockMode: PlayMode = {
    id: 'demo',
    title: 'DEMO',
    description: 'demo',
    enabled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRandom.mockReturnValue(0.5); // Default mock value
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('JudgeCard', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('renders judge name correctly', () => {
      vi.mocked(UseJudgement.useJudgement).mockReturnValue({
        status: 'loading',
      } as any);

      render(
        <JudgeCard
          codeNameOfJudge="JUDGE_A"
          battle={mockBattle}
          mode={mockMode}
        />,
      );

      expect(screen.getByText('Judge JUDGE_A')).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
      vi.mocked(UseJudgement.useJudgement).mockReturnValue({
        status: 'loading',
      } as any);

      render(
        <JudgeCard
          codeNameOfJudge="JUDGE_A"
          battle={mockBattle}
          mode={mockMode}
        />,
      );

      expect(screen.getByText('…')).toBeInTheDocument();
    });

    it('shows error state when judgement fails', () => {
      vi.mocked(UseJudgement.useJudgement).mockReturnValue({
        status: 'error',
      } as any);

      render(
        <JudgeCard
          codeNameOfJudge="JUDGE_A"
          battle={mockBattle}
          mode={mockMode}
        />,
      );

      const failedText = screen.getByText('Failed');
      expect(failedText).toBeInTheDocument();
      expect(failedText).toHaveClass('text-destructive');
    });

    it('reveals winner after delay when judgement succeeds', async () => {
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(false);
      mockRandom.mockReturnValue(0.5); // Will create a delay

      vi.mocked(UseJudgement.useJudgement).mockReturnValue({
        status: 'success',
        data: { winner: 'YONO' },
      } as any);

      render(
        <JudgeCard
          codeNameOfJudge="JUDGE_A"
          battle={mockBattle}
          mode={mockMode}
        />,
      );

      // Initially should show loading
      expect(screen.getByText('…')).toBeInTheDocument();

      // Fast-forward past the delay
      act(() => {
        vi.advanceTimersByTime(5000); // Max delay is 4000ms + 1000ms base
      });

      // Should now show the winner
      expect(screen.getByText('YONO')).toBeInTheDocument();
    });

    it('reveals winner immediately when reduced motion is preferred', async () => {
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(true);

      vi.mocked(UseJudgement.useJudgement).mockReturnValue({
        status: 'success',
        data: { winner: 'KOMAE' },
      } as any);

      render(
        <JudgeCard
          codeNameOfJudge="JUDGE_B"
          battle={mockBattle}
          mode={mockMode}
        />,
      );

      // Should show winner immediately
      expect(screen.getByText('KOMAE')).toBeInTheDocument();
    });

    it('resets reveal state when battle changes', () => {
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(true);
      vi.mocked(UseJudgement.useJudgement).mockReturnValue({
        status: 'success',
        data: { winner: 'YONO' },
      } as any);

      const { rerender } = render(
        <JudgeCard
          codeNameOfJudge="JUDGE_A"
          battle={mockBattle}
          mode={mockMode}
        />,
      );

      // Initially shows winner
      expect(screen.getByText('YONO')).toBeInTheDocument();

      // Change battle
      const newBattle = { ...mockBattle, id: 'new-battle' };
      vi.mocked(UseJudgement.useJudgement).mockReturnValue({
        status: 'loading',
      } as any);

      rerender(
        <JudgeCard
          codeNameOfJudge="JUDGE_A"
          battle={newBattle}
          mode={mockMode}
        />,
      );

      // Should reset to loading state
      expect(screen.getByText('…')).toBeInTheDocument();
    });

    it('resets reveal state when judge changes', () => {
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(true);
      vi.mocked(UseJudgement.useJudgement).mockReturnValue({
        status: 'success',
        data: { winner: 'DRAW' },
      } as any);

      const { rerender } = render(
        <JudgeCard
          codeNameOfJudge="JUDGE_A"
          battle={mockBattle}
          mode={mockMode}
        />,
      );

      // Initially shows result
      expect(screen.getByText('DRAW')).toBeInTheDocument();

      // Change judge
      vi.mocked(UseJudgement.useJudgement).mockReturnValue({
        status: 'loading',
      } as any);
      rerender(
        <JudgeCard
          codeNameOfJudge="JUDGE_B"
          battle={mockBattle}
          mode={mockMode}
        />,
      );

      // Should reset to loading state and show new judge name
      expect(screen.getByText('…')).toBeInTheDocument();
      expect(screen.getByText('Judge JUDGE_B')).toBeInTheDocument();
    });

    it('has proper card structure and styling', () => {
      vi.mocked(UseJudgement.useJudgement).mockReturnValue({
        status: 'loading',
      } as any);

      render(
        <JudgeCard
          codeNameOfJudge="JUDGE_A"
          battle={mockBattle}
          mode={mockMode}
        />,
      );

      // Check card structure
      const card = screen
        .getByText('Judge JUDGE_A')
        .closest('[data-slot="card"]');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass(
        'h-full',
        'min-w-0',
        'overflow-hidden',
        'text-center',
        'gap-2',
        'px-0',
        'py-0',
      );
    });

    it('generates different delays for different renders', () => {
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(false);
      vi.mocked(UseJudgement.useJudgement).mockReturnValue({
        status: 'success',
        data: { winner: 'YONO' },
      } as any);

      // First render with one random value
      mockRandom.mockReturnValueOnce(0.2);
      const { unmount } = render(
        <JudgeCard
          codeNameOfJudge="JUDGE_A"
          battle={mockBattle}
          mode={mockMode}
        />,
      );

      expect(mockRandom).toHaveBeenCalled();
      unmount();

      // Second render with different random value
      mockRandom.mockReturnValueOnce(0.8);
      render(
        <JudgeCard
          codeNameOfJudge="JUDGE_B"
          battle={mockBattle}
          mode={mockMode}
        />,
      );

      // Should have called random again for new delay calculation
      expect(mockRandom).toHaveBeenCalledTimes(2);
    });

    it('clears timeout on unmount', () => {
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(false);
      mockRandom.mockReturnValue(0.5);
      vi.mocked(UseJudgement.useJudgement).mockReturnValue({
        status: 'success',
        data: { winner: 'YONO' },
      } as any);

      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount } = render(
        <JudgeCard
          codeNameOfJudge="JUDGE_A"
          battle={mockBattle}
          mode={mockMode}
        />,
      );

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it('handles all winner types correctly', () => {
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(true);

      const winners = ['YONO', 'KOMAE', 'DRAW'] as const;

      winners.forEach((winner, index) => {
        vi.mocked(UseJudgement.useJudgement).mockReturnValue({
          status: 'success',
          data: { winner },
        } as any);

        const { rerender: _rerender, unmount } = render(
          <JudgeCard
            codeNameOfJudge={`JUDGE_${index}`}
            battle={mockBattle}
            mode={mockMode}
          />,
        );

        expect(screen.getByText(winner)).toBeInTheDocument();

        if (index < winners.length - 1) {
          unmount();
        }
      });
    });
  });
});
