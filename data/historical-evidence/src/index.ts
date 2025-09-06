import type { HistoricalSeed, HistoricalSeedMeta } from '@yonokomae/types';

// Import all scenario seeds - English versions as primary
import bannerMixup from './scenario/banner-mixup.en';
import bannerMixupEn from './scenario/banner-mixup.en';
import bannerMixupJa from './scenario/banner-mixup.ja';
import bridgeCounting from './scenario/bridge-counting.en';
import bridgeCountingEn from './scenario/bridge-counting.en';
import bridgeCountingJa from './scenario/bridge-counting.ja';
import bridgeSkirmish from './scenario/bridge-skirmish.en';
import bridgeSkirmishEn from './scenario/bridge-skirmish.en';
import bridgeSkirmishJa from './scenario/bridge-skirmish.ja';
import earlyBird from './scenario/early-bird.en';
import earlyBirdEn from './scenario/early-bird.en';
import earlyBirdJa from './scenario/early-bird.ja';
import lanternRecon from './scenario/lantern-recon.en';
import lanternReconEn from './scenario/lantern-recon.en';
import lanternReconJa from './scenario/lantern-recon.ja';
import misplacedMap from './scenario/misplaced-map.en';
import misplacedMapEn from './scenario/misplaced-map.en';
import misplacedMapJa from './scenario/misplaced-map.ja';
import picnicHighNoon from './scenario/picnic-high-noon.en';
import picnicHighNoonEn from './scenario/picnic-high-noon.en';
import picnicHighNoonJa from './scenario/picnic-high-noon.ja';
import puddleOffensive from './scenario/puddle-offensive.en';
import puddleOffensiveEn from './scenario/puddle-offensive.en';
import puddleOffensiveJa from './scenario/puddle-offensive.ja';
import queueFormation from './scenario/queue-formation.en';
import queueFormationEn from './scenario/queue-formation.en';
import queueFormationJa from './scenario/queue-formation.ja';
import tamaRiver from './scenario/tama-river.en';
import tamaRiverEn from './scenario/tama-river.en';
import tamaRiverJa from './scenario/tama-river.ja';
import teapotStandOff from './scenario/teapot-stand-off.en';
import teapotStandOffEn from './scenario/teapot-stand-off.en';
import teapotStandOffJa from './scenario/teapot-stand-off.ja';
import umbrellaRidge from './scenario/umbrella-ridge.en';
import umbrellaRidgeEn from './scenario/umbrella-ridge.en';
import umbrellaRidgeJa from './scenario/umbrella-ridge.ja';

// Import neta data - English versions as primary
import netaKomae from './neta/komae.en';
import netaKomaeEn from './neta/komae.en';
import netaKomaeJa from './neta/komae.ja';
import netaYono from './neta/yono.en';
import netaYonoEn from './neta/yono.en';
import netaYonoJa from './neta/yono.ja';

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
