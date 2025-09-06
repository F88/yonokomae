import type { HistoricalSeed, HistoricalSeedMeta } from '@yonokomae/types';
import netaKomae from './neta/komae.en.js';
import netaKomaeEn from './neta/komae.en.js';
import netaKomaeJa from './neta/komae.ja.js';
import netaYono from './neta/yono.en.js';
import netaYonoEn from './neta/yono.en.js';
import netaYonoJa from './neta/yono.ja.js';
export declare const historicalSeedMetas: HistoricalSeedMeta[];
export declare const historicalSeeds: HistoricalSeed[];
export declare const historicalSeedsByFile: Record<string, HistoricalSeed>;
export declare function loadSeedByFile(
  file: string,
): HistoricalSeed | undefined;
export {
  netaKomae,
  netaKomaeEn,
  netaKomaeJa,
  netaYono,
  netaYonoEn,
  netaYonoJa,
};
//# sourceMappingURL=index.d.ts.map
