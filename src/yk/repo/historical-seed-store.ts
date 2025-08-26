import { createContext, useContext, useMemo, useState } from 'react';

export type HistoricalSeedSelection = {
  seedFile?: string;
  setSeedFile: (file?: string) => void;
};

const Ctx = createContext<HistoricalSeedSelection | null>(null);

export function useHistoricalSeedSelection(): HistoricalSeedSelection | null {
  return useContext(Ctx);
}

export function HistoricalSeedProvider({ children }: { children: React.ReactNode }) {
  const [seedFile, setSeedFile] = useState<string | undefined>(undefined);
  const value = useMemo(() => ({ seedFile, setSeedFile }), [seedFile]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
