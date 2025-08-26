import { useCallback } from 'react';
import type { Battle } from '@/types/types';
import type { PlayMode } from '@/yk/play-mode';
import { getBattleReportRepository } from '@/yk/repository-provider';

/**
 * useGenerateReport
 *
 * Exposes an async API to generate a battle report. Internally wraps the
 * synchronous generator so it can be swapped with a real API without
 * changing callers.
 */
export function useGenerateReport(mode?: PlayMode) {
  const generateReport = useCallback(async (): Promise<Battle> => {
    const repo = await getBattleReportRepository(mode);
    return repo.generateReport();
  }, [mode]);

  return { generateReport };
}
