import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

vi.mock('@/yk/repo/core/repository-context', () => ({
  useRepositoriesOptional: vi.fn(),
}));

vi.mock('@/yk/repo/core/repository-provider', () => ({
  getJudgementRepository: vi.fn(),
}));

import { useJudgement } from '@/hooks/use-judgement';
import type { Battle } from '@/types/types';
import type { PlayMode } from '@/yk/play-mode';
import { useRepositoriesOptional } from '@/yk/repo/core/repository-context';
import { getJudgementRepository } from '@/yk/repo/core/repository-provider';

const battle: Battle = {
  id: 'b1',
  title: 't',
  subtitle: 's',
  overview: 'o',
  scenario: 'sc',
  yono: {
    imageUrl: '',
    title: 'y',
    subtitle: 'ys',
    description: 'yd',
    power: 2,
  },
  komae: {
    imageUrl: '',
    title: 'k',
    subtitle: 'ks',
    description: 'kd',
    power: 1,
  },
};
const mode: PlayMode = {
  id: 'demo',
  title: 'Demo',
  description: '',
  enabled: true,
};

function Probe({ repoKind }: { repoKind: 'provided' | 'factory' }) {
  const j = useJudgement('Judge', battle, mode);
  return (
    <div>
      <span data-testid="status">{j.status}</span>
      <span data-testid="data">{j.data ? j.data.winner : ''}</span>
      <span data-testid="error">{j.error ? 'err' : ''}</span>
      <span data-testid="repoKind">{repoKind}</span>
    </div>
  );
}

describe('useJudgement', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.resetModules();
  });

  it('transitions to success using provided repo', async () => {
    (
      useRepositoriesOptional as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      battleReport: undefined as unknown as never,
      judgement: {
        determineWinner: vi.fn(async () => ({
          winner: 'YONO',
          reason: 'power',
        })),
      },
    });
    render(<Probe repoKind="provided" />);
    expect(screen.getByTestId('status').textContent).toBe('loading');
    await act(async () => {}); // flush microtasks
    expect(screen.getByTestId('status').textContent).toBe('success');
    expect(screen.getByTestId('data').textContent).toBe('YONO');
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('transitions to error using factory repo', async () => {
    (
      useRepositoriesOptional as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(null);
    (
      getJudgementRepository as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      determineWinner: vi.fn(async () => {
        throw new Error('x');
      }),
    });
    render(<Probe repoKind="factory" />);
    expect(screen.getByTestId('status').textContent).toBe('loading');
    await act(async () => {});
    expect(screen.getByTestId('status').textContent).toBe('error');
    expect(screen.getByTestId('error').textContent).toBe('err');
  });
});
