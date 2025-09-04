import type { HistoricalSeed, HistoricalSeedMeta } from '@yonokomae/types';

// Import all scenario seeds - English versions as primary
import bannerMixup from './scenario/banner-mixup.en.js';
import bannerMixupEn from './scenario/banner-mixup.en.js';
import bannerMixupJa from './scenario/banner-mixup.ja.js';
import bridgeCounting from './scenario/bridge-counting.en.js';
import bridgeCountingEn from './scenario/bridge-counting.en.js';
import bridgeCountingJa from './scenario/bridge-counting.ja.js';
import bridgeSkirmish from './scenario/bridge-skirmish.en.js';
import bridgeSkirmishEn from './scenario/bridge-skirmish.en.js';
import bridgeSkirmishJa from './scenario/bridge-skirmish.ja.js';
import earlyBird from './scenario/early-bird.en.js';
import earlyBirdEn from './scenario/early-bird.en.js';
import earlyBirdJa from './scenario/early-bird.ja.js';
import lanternRecon from './scenario/lantern-recon.en.js';
import lanternReconEn from './scenario/lantern-recon.en.js';
import lanternReconJa from './scenario/lantern-recon.ja.js';
import misplacedMap from './scenario/misplaced-map.en.js';
import misplacedMapEn from './scenario/misplaced-map.en.js';
import misplacedMapJa from './scenario/misplaced-map.ja.js';
import picnicHighNoon from './scenario/picnic-high-noon.en.js';
import picnicHighNoonEn from './scenario/picnic-high-noon.en.js';
import picnicHighNoonJa from './scenario/picnic-high-noon.ja.js';
import puddleOffensive from './scenario/puddle-offensive.en.js';
import puddleOffensiveEn from './scenario/puddle-offensive.en.js';
import puddleOffensiveJa from './scenario/puddle-offensive.ja.js';
import queueFormation from './scenario/queue-formation.en.js';
import queueFormationEn from './scenario/queue-formation.en.js';
import queueFormationJa from './scenario/queue-formation.ja.js';
import tamaRiver from './scenario/tama-river.en.js';
import tamaRiverEn from './scenario/tama-river.en.js';
import tamaRiverJa from './scenario/tama-river.ja.js';
import teapotStandOff from './scenario/teapot-stand-off.en.js';
import teapotStandOffEn from './scenario/teapot-stand-off.en.js';
import teapotStandOffJa from './scenario/teapot-stand-off.ja.js';
import umbrellaRidge from './scenario/umbrella-ridge.en.js';
import umbrellaRidgeEn from './scenario/umbrella-ridge.en.js';
import umbrellaRidgeJa from './scenario/umbrella-ridge.ja.js';

// Import neta data - English versions as primary
import netaKomae from './neta/komae.en.js';
import netaKomaeEn from './neta/komae.en.js';
import netaKomaeJa from './neta/komae.ja.js';
import netaYono from './neta/yono.en.js';
import netaYonoEn from './neta/yono.en.js';
import netaYonoJa from './neta/yono.ja.js';

// Collect all seeds in a map - include all language variants for lookups
const allSeedsMap: Record<string, HistoricalSeed> = {
  'banner-mixup.en.ts': bannerMixupEn,
  'banner-mixup.ja.ts': bannerMixupJa,
  'bridge-counting.en.ts': bridgeCountingEn,
  'bridge-counting.ja.ts': bridgeCountingJa,
  'bridge-skirmish.en.ts': bridgeSkirmishEn,
  'bridge-skirmish.ja.ts': bridgeSkirmishJa,
  'early-bird.en.ts': earlyBirdEn,
  'early-bird.ja.ts': earlyBirdJa,
  'lantern-recon.en.ts': lanternReconEn,
  'lantern-recon.ja.ts': lanternReconJa,
  'misplaced-map.en.ts': misplacedMapEn,
  'misplaced-map.ja.ts': misplacedMapJa,
  'picnic-high-noon.en.ts': picnicHighNoonEn,
  'picnic-high-noon.ja.ts': picnicHighNoonJa,
  'puddle-offensive.en.ts': puddleOffensiveEn,
  'puddle-offensive.ja.ts': puddleOffensiveJa,
  'queue-formation.en.ts': queueFormationEn,
  'queue-formation.ja.ts': queueFormationJa,
  'tama-river.en.ts': tamaRiverEn,
  'tama-river.ja.ts': tamaRiverJa,
  'teapot-stand-off.en.ts': teapotStandOffEn,
  'teapot-stand-off.ja.ts': teapotStandOffJa,
  'umbrella-ridge.en.ts': umbrellaRidgeEn,
  'umbrella-ridge.ja.ts': umbrellaRidgeJa,
};

// Main seed map uses English versions as primary to avoid duplicate IDs
const seedMap: Record<string, HistoricalSeed> = {
  'banner-mixup.en.ts': bannerMixup,
  'bridge-counting.en.ts': bridgeCounting,
  'bridge-skirmish.en.ts': bridgeSkirmish,
  'early-bird.en.ts': earlyBird,
  'lantern-recon.en.ts': lanternRecon,
  'misplaced-map.en.ts': misplacedMap,
  'picnic-high-noon.en.ts': picnicHighNoon,
  'puddle-offensive.en.ts': puddleOffensive,
  'queue-formation.en.ts': queueFormation,
  'tama-river.en.ts': tamaRiver,
  'teapot-stand-off.en.ts': teapotStandOff,
  'umbrella-ridge.en.ts': umbrellaRidge,
};

// Build metadata array
export const historicalSeedMetas: HistoricalSeedMeta[] = Object.keys(seedMap)
  .sort()
  .map((file) => {
    const seed = seedMap[file];
    return {
      id:
        seed?.id ||
        file
          .replace(/\.(en|ja)\.(ts|js|json)$/, '')
          .replace(/\.(ts|js|json)$/, ''),
      title:
        seed?.title ||
        file
          .replace(/\.(en|ja)\.(ts|js|json)$/, '')
          .replace(/\.(ts|js|json)$/, ''),
      file,
    };
  });

// Export all seeds as an array
export const historicalSeeds: HistoricalSeed[] = Object.values(seedMap);

// Export seed map for file-based lookup (includes all language variants)
export const historicalSeedsByFile = allSeedsMap;

// Load seed by file name
export function loadSeedByFile(file: string): HistoricalSeed | undefined {
  return allSeedsMap[file];
}

// Export neta data
export {
  netaKomae,
  netaKomaeEn,
  netaKomaeJa,
  netaYono,
  netaYonoEn,
  netaYonoJa,
};
