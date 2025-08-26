import { useCallback } from 'react';
import { useHistoricalSeedSelection } from './use-historical-seed-selection';

/**
 *
 */
export function useRotateHistoricalSeed() {
  const ctx = useHistoricalSeedSelection();
  return useCallback(() => {
    ctx?.rotateSeed();
  }, [ctx]);
}
