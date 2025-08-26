import React, { useMemo, useState } from 'react';
import { Ctx, type HistoricalSeedSelection } from './historical-seed-context';

export function HistoricalSeedProvider({ children }: { children: React.ReactNode }) {
  const [seedFile, setSeedFile] = useState<string | undefined>(undefined);
  const value: HistoricalSeedSelection = useMemo(
    () => ({ seedFile, setSeedFile }),
    [seedFile]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
