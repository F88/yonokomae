import React, { useCallback, useMemo, useState } from 'react';
import { Ctx, type HistoricalSeedSelection } from './seed-context';
import { historicalSeeds } from './seeds';

export function HistoricalSeedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seedFile, setSeedFile] = useState<string | undefined>(undefined);
  const rotateSeed = useCallback(() => {
    if (historicalSeeds.length === 0) return;
    const idx = seedFile
      ? historicalSeeds.findIndex((s) => s.file === seedFile)
      : -1;
    const nextIdx = (idx + 1) % historicalSeeds.length;
    setSeedFile(historicalSeeds[nextIdx]?.file);
  }, [seedFile]);
  const value: HistoricalSeedSelection = useMemo(
    () => ({ seedFile, setSeedFile, rotateSeed }),
    [seedFile, rotateSeed],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
