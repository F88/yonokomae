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
    async (name: string = 'John Doe'): Promise<Battle> => {
      const sleep = (ms: number) =>
        new Promise<void>((resolve) => setTimeout(resolve, ms));
      const delayMs = 1000 + Math.floor(Math.random() * 2000); // 1..3s
      // Wait 1 .. 3 secs before resolving
      await sleep(delayMs);
      // Lazy-load the journalist (and heavy faker dep) only when needed
      const { FrontlineJournalist } = await import('@/yk/frontline-journalist');
      const j = new FrontlineJournalist(name);
      // Keep it async-friendly for future API integration.
      return j.report();
    },
    [],
  );

  return { generateReport };
}
