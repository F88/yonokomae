import { useCallback } from 'react';
import { useHistoricalSeedSelection } from './use-historical-seed-selection';

/**
 * useRotateHistoricalSeed
 *
 * Thin convenience hook that returns a stable function to rotate
 * the currently selected historical seed. Requires provider.
 */
  return useCallback(() => ctx.rotateSeed(), [ctx.rotateSeed]);
}
