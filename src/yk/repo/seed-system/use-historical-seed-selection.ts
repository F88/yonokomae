import { useContext } from 'react';
import { Ctx, type HistoricalSeedSelection } from './historical-seed-context';

export function useHistoricalSeedSelection(): HistoricalSeedSelection | null {
  return useContext(Ctx);
}
