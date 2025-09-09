import type { Battle } from '@yonokomae/types';
export declare const battleSeeds: Battle[];
export declare const publishedBattleSeeds: Battle[]; // published-only view
export declare const battleSeedsById: Record<string, Battle>;
export declare const battleSeedsByFile: Record<string, Battle>;
export declare function loadBattleSeedByFile(file: string): Battle | undefined;
export declare function loadBattleSeedById(id: string): Battle | undefined;
export declare const allBattleSeeds: Battle[];
export declare function battleSeedPublishStats(): {
  total: number;
  byState: Record<string, number>;
  publishedRatio: number;
};
//# sourceMappingURL=index.d.ts.map
