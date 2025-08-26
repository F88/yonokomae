import React, { use, useMemo } from 'react';
import type { PlayMode } from '../play-mode';
import type {
  BattleReportRepository,
  JudgementRepository,
} from './repositories';
import {
  getBattleReportRepository,
  getJudgementRepository,
} from './repository-provider';
import { RepoContext, type RepoContextValue } from './repository-context';

export function RepositoryProvider({
  mode,
  children,
}: {
  mode?: PlayMode;
  children: React.ReactNode;
}) {
  const value = useMemo<RepoContextValue>(() => {
    const battleReport = {
      generateReport: async (opts?: { signal?: AbortSignal }) => {
        const repo = await getBattleReportRepository(mode);
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
  }, [mode]);

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
