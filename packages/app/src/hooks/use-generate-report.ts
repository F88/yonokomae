import { useCallback, useMemo } from 'react';
import type { Battle } from '@yonokomae/types';
import type {
  GenerateBattleReportParams,
  BattleReportFilter,
} from '@/yk/repo/core/repositories';
import type { PlayMode } from '@/yk/play-mode';
import { getBattleReportRepository } from '@/yk/repo/core/repository-provider';
import { useRepositoriesOptional } from '@/yk/repo/core/repository-context';

/**
 * useGenerateReport
 *
 * Exposes an async API to generate a battle report. Internally wraps the
 * synchronous generator so it can be swapped with a real API without
 * changing callers.
 */
export function useGenerateReport(mode?: PlayMode, seedFile?: string) {
  const provided = useRepositoriesOptional();
  const timeoutMs = useMemo(() => 10_000, []);
  const generateReport = useCallback(
    async (params?: { filter?: BattleReportFilter }): Promise<Battle> => {
      const repo =
        provided?.battleReport ??
        (await getBattleReportRepository(mode, seedFile));
      const controller = new AbortController();
      let timer: ReturnType<typeof setTimeout> | null = null;
      try {
        timer = setTimeout(() => controller.abort(), timeoutMs);
        const unified: GenerateBattleReportParams = {
          filter: params?.filter,
          signal: controller.signal,
        };
        const result = await repo.generateReport(unified);
        if (timer) clearTimeout(timer);
        timer = null;
        return result;
      } finally {
        if (timer) clearTimeout(timer);
      }
    },
    [mode, seedFile, provided, timeoutMs],
  );

  return { generateReport };
}
