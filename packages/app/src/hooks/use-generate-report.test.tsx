import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useState } from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';

// Mock repository context and provider factory
vi.mock('@/yk/repo/core/repository-context', () => ({
  useRepositoriesOptional: vi.fn(),
}));

vi.mock('@/yk/repo/core/repository-provider', () => ({
  getBattleReportRepository: vi.fn(),
}));

import { useGenerateReport } from '@/hooks/use-generate-report';
import type { Battle } from '@yonokomae/types';
import { useRepositoriesOptional } from '@/yk/repo/core/repository-context';
import { getBattleReportRepository } from '@/yk/repo/core/repository-provider';

const sample: Battle = {
  id: 'id1',
  themeId: 'history',
  significance: 'low',
  title: 't',
  subtitle: 's',
  narrative: { overview: 'o', scenario: 'sc' },
  yono: {
    imageUrl: '',
    title: 'y',
    subtitle: 'ys',
    description: 'yd',
    power: 1,
  },
  komae: {
    imageUrl: '',
    title: 'k',
    subtitle: 'ks',
    description: 'kd',
    power: 2,
  },
};

function Probe({ onDone }: { onDone: (b: Battle) => void }) {
  const { generateReport } = useGenerateReport();
  const [running, setRunning] = useState(false);
  return (
    <button
      data-testid="run"
      disabled={running}
      onClick={async () => {
        setRunning(true);
        const b = await generateReport();
        onDone(b);
        setRunning(false);
      }}
    >
      run
    </button>
  );
}

describe('useGenerateReport', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('uses provided repository from context when available', async () => {
    const generate = vi.fn(async () => sample);
    (
      useRepositoriesOptional as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      battleReport: { generateReport: generate },
      // judgement not used here
      judgement: {} as unknown as never,
    });
    const done = vi.fn();
    render(<Probe onDone={done} />);
    await act(async () => {
      await fireEvent.click(screen.getByTestId('run'));
    });
    await waitFor(() => expect(generate).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(done).toHaveBeenCalledWith(sample));
    expect(getBattleReportRepository).not.toHaveBeenCalled();
  });

  it('falls back to factory when no context is provided and passes AbortSignal', async () => {
    (
      useRepositoriesOptional as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(null);
    const genSpy = vi.fn(async () => sample);
    (
      getBattleReportRepository as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      generateReport: genSpy,
    });
    const done = vi.fn();
    render(<Probe onDone={done} />);
    await act(async () => {
      await fireEvent.click(screen.getByTestId('run'));
    });
    await waitFor(() => expect(getBattleReportRepository).toHaveBeenCalled());
    await waitFor(() => expect(genSpy).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(done).toHaveBeenCalledWith(sample));
  });
});
