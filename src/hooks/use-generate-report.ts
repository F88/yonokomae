import { useCallback } from 'react';
import type { Battle } from '@/types/types';

/**
 * useGenerateReport
 *
 * Exposes an async API to generate a battle report. Internally wraps the
 * synchronous generator so it can be swapped with a real API without
 * changing callers.
 */
export function useGenerateReport() {
  const generateReport = useCallback(
    async (): Promise<Battle> => {
  // Lazy-load fake repo (and heavy faker dep) only when needed
  const { FakeBattleReportRepository } = await import('@/yk/repositories.fake');
  const repo = new FakeBattleReportRepository();
  // Preserve async shape for future API integration; latency could be simulated in the repo layer.
  return repo.generateReport();
    },
    [],
  );

  return { generateReport };
}
