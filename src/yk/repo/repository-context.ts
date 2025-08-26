import { createContext, useContext } from 'react';
import type {
  BattleReportRepository,
  JudgementRepository,
} from './repositories';

export type RepoContextValue = {
  battleReport: BattleReportRepository;
  judgement: JudgementRepository;
};

export const RepoContext = createContext<RepoContextValue | null>(null);

export function useRepositories(): RepoContextValue {
  const ctx = useContext(RepoContext);
  if (!ctx)
    throw new Error('useRepositories must be used within RepositoryProvider');
  return ctx;
}

export function useRepositoriesOptional(): RepoContextValue | null {
  return useContext(RepoContext);
}
