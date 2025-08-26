import { useCallback } from 'react';
import { useHistoricalSeedSelection } from './use-historical-seed-selection';

/**
 * Hook to rotate the historical seed selection to the next available seed.
 */
export function useRotateHistoricalSeed() {
  const ctx = useHistoricalSeedSelection();
  return useCallback(() => {
    ctx?.rotateSeed();
  }, [ctx]);
}
