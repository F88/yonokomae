import type { Battle } from '@yonokomae/types';
// All battle seed imports (published & draft) are now auto-generated.
// To update after adding / modifying battle files with publishState changes:
//   pnpm --filter @yonokomae/data-battle-seeds run generate:battles
// (Runs automatically via package prebuild script.)
// NOTE: Explicit .js extension needed for Node ESM runtime (type:module) to resolve after tsc emit.
// For TS sources we can import the .ts (ts-node/tsx) or .js (compiled). Try .js first for emitted builds.
// Vitest in source mode resolves the .ts via tsconfig paths anyway.
import {
  publishedBattleMap,
  draftBattleMap,
  allBattleMap,
  battleMapsByPublishState,
  battleSeedsByPublishState,
  publishStateKeys,
  type PublishStateKey,
} from './battle/__generated/index.generated.js';

// Unified map (file-name based). Prefer ID-based lookups in new code.
const battleMap: Record<string, Battle> = allBattleMap;

// Export all battles as an array (includes unpublished / draft states)
function normalizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  // Remove any literal 'undefined' prefix (legacy) and handle build-time BASE_URL templates.
  return url
    .replace(/^undefined/, '')
    .replace(/\${import\.meta\.env\.BASE_URL}/g, '');
}

export const battleSeeds: Battle[] = Object.values(battleMap).map((b) => ({
  ...b,
  komae: { ...b.komae, imageUrl: normalizeImageUrl(b.komae.imageUrl) ?? '' },
  yono: { ...b.yono, imageUrl: normalizeImageUrl(b.yono.imageUrl) ?? '' },
}));

// ID ベース高速ルックアップ
export const battleSeedsById: Record<string, Battle> = battleSeeds.reduce(
  (acc, b) => {
    acc[b.id] = b;
    return acc;
  },
  {} as Record<string, Battle>,
);

// Published only view
export const publishedBattleSeeds: Battle[] = Object.values(publishedBattleMap)
  .map((b) => battleSeedsById[b.id])
  .filter((b): b is Battle => Boolean(b));

// Draft (non-published) view (convenience)
export const draftBattleSeeds: Battle[] = Object.values(draftBattleMap)
  .map((b) => battleSeedsById[b.id])
  .filter((b): b is Battle => Boolean(b));

// publishState -> Battle[] convenience re-export
export {
  battleSeedsByPublishState,
  battleMapsByPublishState,
  publishStateKeys,
};
export type { PublishStateKey };

export function battleSeedPublishStats(): {
  total: number;
  byState: Record<string, number>;
  publishedRatio: number;
} {
  const byState: Record<string, number> = {};
  for (const b of battleSeeds) {
    const state = b.publishState ?? 'published';
    byState[state] = (byState[state] ?? 0) + 1;
  }
  const total = battleSeeds.length;
  const publishedCount = byState['published'] ?? 0;
  return {
    total,
    byState,
    publishedRatio: total > 0 ? publishedCount / total : 0,
  };
}

// Legacy file-name map (basename -> Battle)
export const battleSeedsByFile = battleMap;

export function loadBattleSeedByFile(file: string): Battle | undefined {
  return battleMap[file];
}

export function loadBattleSeedById(id: string): Battle | undefined {
  return battleSeedsById[id];
}

export const allBattleSeeds = battleSeeds;
