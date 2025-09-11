import type { PlayMode } from '@/yk/play-mode';
import { render, screen } from '@testing-library/react';
import type { Battle } from '@yonokomae/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConsiderationsAndJudgments } from './ConsiderationsAndJudgments';

// Mock the dependencies
vi.mock('@/lib/scroll', () => ({
  scrollToAnchor: vi.fn(),
}));

vi.mock('@/hooks/use-breakpoint', () => ({
  BREAKPOINTS: { lg: '1024px' },
}));

vi.mock('@/yk/judges', () => ({
  JUDGES: [
    { codeName: 'JUDGE_A' },
    { codeName: 'JUDGE_B' },
    { codeName: 'JUDGE_C' },
    { codeName: 'JUDGE_D' },
    { codeName: 'JUDGE_E' },
  ],
}));

vi.mock('@/components/battle/Judge', () => ({
  JudgeCard: ({
    codeNameOfJudge,
    battle,
  }: {
    codeNameOfJudge: string;
    battle: Battle;
  }) => (
    <div data-testid={`judge-card-${codeNameOfJudge}`}>
      Judge {codeNameOfJudge} for {battle.title}
    </div>
  ),
}));

// Mock Math.random to make tests deterministic
const mockRandom = vi.fn();
Object.defineProperty(global.Math, 'random', {
  value: mockRandom,
  writable: true,
});

describe('ConsiderationsAndJudgments', () => {
  const mockBattle: Battle = {
    id: 'test-battle-1',
    publishState: 'published',
    title: 'Test Battle Title',
    subtitle: '',
    narrative: { overview: '', scenario: '' },
    themeId: 'history',
    significance: 'high',
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
    provenance: [],
  };

  const mockMode: PlayMode = {
    id: 'demo',
    title: 'DEMO',
    description: 'Demonstration mode',
    srLabel: 'Demo Mode',
    enabled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRandom.mockReset();
  });

  it('returns null when battle is undefined', () => {
    const { container } = render(
      <ConsiderationsAndJudgments battle={undefined} mode={mockMode} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders battle title and judges when battle is provided', () => {
    // Mock random to select some judges (probability 4/7)
    mockRandom
      .mockReturnValueOnce(0.5) // JUDGE_A selected (< 4/7)
      .mockReturnValueOnce(0.6) // JUDGE_B not selected (> 4/7)
      .mockReturnValueOnce(0.4) // JUDGE_C selected (< 4/7)
      .mockReturnValueOnce(0.8) // JUDGE_D not selected (> 4/7)
      .mockReturnValueOnce(0.3); // JUDGE_E selected (< 4/7)

    render(<ConsiderationsAndJudgments battle={mockBattle} mode={mockMode} />);

    expect(screen.getByText("Judge's Comments")).toBeInTheDocument();
    expect(screen.getByText('Test Battle Title')).toBeInTheDocument();

    // Check that selected judges are rendered
    expect(screen.getByTestId('judge-card-JUDGE_A')).toBeInTheDocument();
    expect(screen.getByTestId('judge-card-JUDGE_C')).toBeInTheDocument();
    expect(screen.getByTestId('judge-card-JUDGE_E')).toBeInTheDocument();

    // Check that non-selected judges are not rendered
    expect(screen.queryByTestId('judge-card-JUDGE_B')).not.toBeInTheDocument();
    expect(screen.queryByTestId('judge-card-JUDGE_D')).not.toBeInTheDocument();
  });

  it('limits judges to maximum of 4 when more are selected', () => {
    // Mock random to select all judges initially
    mockRandom
      .mockReturnValueOnce(0.3) // JUDGE_A selected
      .mockReturnValueOnce(0.4) // JUDGE_B selected
      .mockReturnValueOnce(0.2) // JUDGE_C selected
      .mockReturnValueOnce(0.5) // JUDGE_D selected
      .mockReturnValueOnce(0.1) // JUDGE_E selected
      // Shuffle mocks for taking first 4
      .mockReturnValueOnce(0.8) // for shuffle
      .mockReturnValueOnce(0.3) // for shuffle
      .mockReturnValueOnce(0.9) // for shuffle
      .mockReturnValueOnce(0.1); // for shuffle

    render(<ConsiderationsAndJudgments battle={mockBattle} mode={mockMode} />);

    // Should only render 4 judges maximum
    const judgeCards = screen.getAllByTestId(/^judge-card-/);
    expect(judgeCards).toHaveLength(4);
  });

  it('can select 0 judges when probability is low', () => {
    // Mock random to select no judges (all > 4/7)
    mockRandom
      .mockReturnValueOnce(0.8) // JUDGE_A not selected
      .mockReturnValueOnce(0.9) // JUDGE_B not selected
      .mockReturnValueOnce(0.7) // JUDGE_C not selected
      .mockReturnValueOnce(0.8) // JUDGE_D not selected
      .mockReturnValueOnce(0.9); // JUDGE_E not selected

    render(<ConsiderationsAndJudgments battle={mockBattle} mode={mockMode} />);

    expect(screen.getByText("Judge's Comments")).toBeInTheDocument();
    expect(screen.getByText('Test Battle Title')).toBeInTheDocument();

    // No judge cards should be rendered
    expect(screen.queryByTestId(/^judge-card-/)).not.toBeInTheDocument();
  });

  it('renders correct battle link with anchor', () => {
    mockRandom.mockReturnValue(0.8); // No judges selected

    render(<ConsiderationsAndJudgments battle={mockBattle} mode={mockMode} />);

    const link = screen.getByRole('link', { name: /Test Battle Title/ });
    expect(link).toHaveAttribute('href', '#test-battle-1');
    expect(link).toHaveAttribute('title', 'Scroll to the top of this battle');
  });

  it('has proper card structure and styling', () => {
    mockRandom.mockReturnValue(0.8); // No judges selected

    render(<ConsiderationsAndJudgments battle={mockBattle} mode={mockMode} />);

    // Check card structure
    const card = screen
      .getByText("Judge's Comments")
      .closest('[data-slot="card"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass(
      'w-full',
      'overflow-hidden',
      'py-0',
      'pb-2',
      'gap-0',
      'max-w-none',
      'h-full',
    );
  });
});
