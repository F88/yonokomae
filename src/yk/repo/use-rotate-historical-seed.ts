import { useCallback } from 'react';
import { useHistoricalSeedSelection } from './use-historical-seed-selection';

/**
 * useRotateHistoricalSeed
 *
 * Thin convenience hook that returns a stable function to rotate
 * the currently selected historical seed. Requires provider.
 */
export function useRotateHistoricalSeed(): () => void {
  const ctx = useHistoricalSeedSelection();
  if (!ctx) {
    throw new Error(
      'useRotateHistoricalSeed must be used within HistoricalSeedProvider',
    );
  }
  return useCallback(() => ctx.rotateSeed(), [ctx]);
}
