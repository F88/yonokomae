import { useCallback } from 'react';
import { useHistoricalSeedSelection } from '@/yk/repo/seed-system';

/**
 * Hook to rotate the historical seed selection to the next available seed.
 */
export function useRotateHistoricalSeed() {
  const ctx = useHistoricalSeedSelection();
  return useCallback(() => {
    ctx?.rotateSeed();
  }, [ctx]);
}
