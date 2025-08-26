import React, { use, useMemo } from 'react';
import type { PlayMode } from '../play-mode';
import type {
  BattleReportRepository,
  JudgementRepository,
} from './core/repositories';
import {
  getBattleReportRepository,
  getJudgementRepository,
} from './repository-provider';
import { RepoContext, type RepoContextValue } from './repository-context';
import { useHistoricalSeedSelection } from './seed-system/historical-seed-store';

export function RepositoryProvider({
  mode,
  children,
}: {
  mode?: PlayMode;
  children: React.ReactNode;
}) {
  const seedSelection = useHistoricalSeedSelection();
  const value = useMemo<RepoContextValue>(() => {
    const battleReport = {
      generateReport: async (opts?: { signal?: AbortSignal }) => {
        const repo = await getBattleReportRepository(
          mode,
          seedSelection?.seedFile,
        );
        return repo.generateReport(opts);
      },
    } as BattleReportRepository;
    const judgement = {
      determineWinner: async (
        ...args: Parameters<JudgementRepository['determineWinner']>
      ) => {
        const repo = await getJudgementRepository(mode);
        return repo.determineWinner(...args);
      },
    } as JudgementRepository;
    return { battleReport, judgement };
  }, [mode, seedSelection?.seedFile]);

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
}

// Suspense-ready provider for API repos that need async initialization.
// It resolves concrete repository instances up-front and provides them via context.
export function RepositoryProviderSuspense({
  mode,
  children,
}: {
  mode?: PlayMode;
  children: React.ReactNode;
}) {
  const promise = useMemo(() => initRepositories(mode), [mode]);
  const value = use(promise);
  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
}

async function initRepositories(mode?: PlayMode): Promise<RepoContextValue> {
  const [battleReport, judgement] = await Promise.all([
    getBattleReportRepository(mode),
    getJudgementRepository(mode),
  ]);
  return { battleReport, judgement };
}
