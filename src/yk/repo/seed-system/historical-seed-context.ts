import { createContext } from 'react';

export type HistoricalSeedSelection = {
  seedFile?: string; // e.g., 'tama-river.json'
  setSeedFile: (file?: string) => void;
  rotateSeed: () => void;
};

export const Ctx = createContext<HistoricalSeedSelection | null>(null);
