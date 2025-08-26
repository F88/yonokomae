import { useCallback, useMemo } from 'react';
import type { Battle } from '@/types/types';
import type { PlayMode } from '@/yk/play-mode';
import { getBattleReportRepository } from '@/yk/repo/repository-provider';
import { useRepositoriesOptional } from '@/yk/repo/repository-context';

/**
 * useGenerateReport
 *
 * Exposes an async API to generate a battle report. Internally wraps the
 * synchronous generator so it can be swapped with a real API without
 * changing callers.
 */
export function useGenerateReport(mode?: PlayMode) {
  const provided = useRepositoriesOptional();
  const timeoutMs = useMemo(() => 10_000, []);
  const generateReport = useCallback(async (): Promise<Battle> => {
    const repo =
      provided?.battleReport ?? (await getBattleReportRepository(mode));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await repo.generateReport({ signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }, [mode, provided, timeoutMs]);

  return { generateReport };
}
