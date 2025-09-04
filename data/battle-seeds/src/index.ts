import type { Battle } from '@yonokomae/types';

// Import all battle seeds of HWMB
import hwmbYK from './battle/hwmb-yk.ja.js';
import hwmbYonoJa from './battle/hwmb-yono.ja.js';
import hwmbKomaeJa from './battle/hwmb-komae.ja.js';

// Import all battle seeds of after HWMB
// import yonoKomaeAdjacentMunicipalitiesJa from './battle/yono-komae-adjacent-municipalities.ja.js';
// import yonoKomaeAgricultureJa from './battle/yono-komae-agriculture.ja.js';
// import yonoKomaeAreaComparisonJa from './battle/yono-komae-area-comparison.ja.js';
// import yonoKomaeCommutingFlowsJa from './battle/yono-komae-commuting-flows.ja.js';
import yonoKomaeFisheriesJa from './battle/yono-komae-fisheries.ja.js';
import yonoKomaeGeomorphologyHydrologyJa from './battle/yono-komae-geomorphology-hydrology.ja.js';
import yonoKomaeIndustryGrowthJa from './battle/yono-komae-industry-growth.ja.js';
// import yonoKomaeMeteorologyJa from './battle/yono-komae-meteorology.ja.js';
// import yonoKomaePopulationTrendsJa from './battle/yono-komae-population-trends.ja.js';
// import yonoKomaeSocioeconomicJa from './battle/yono-komae-socioeconomic.ja.js';
import cityNameOriginJa from './battle/city-name-origin.ja.js';

// Collect all battles in a map
const battleMap: Record<string, Battle> = {
  ...{
    'hwmb-yk.ja.ts': hwmbYK,
    'hwmb-yono.ja.ts': hwmbYonoJa,
    'hwmb-komae.ja.ts': hwmbKomaeJa,
  },
  ...{
    // 'yono-komae-adjacent-municipalities.ja.ts': yonoKomaeAdjacentMunicipalitiesJa,
    // 'yono-komae-agriculture.ja.ts': yonoKomaeAgricultureJa,
    // 'yono-komae-area-comparison.ja.ts': yonoKomaeAreaComparisonJa,
    // 'yono-komae-commuting-flows.ja.ts': yonoKomaeCommutingFlowsJa,
    'yono-komae-fisheries.ja.ts': yonoKomaeFisheriesJa,
    'yono-komae-geomorphology-hydrology.ja.ts':
      yonoKomaeGeomorphologyHydrologyJa,
    'yono-komae-industry-growth.ja.ts': yonoKomaeIndustryGrowthJa,
    // 'yono-komae-meteorology.ja.ts': yonoKomaeMeteorologyJa,
    // 'yono-komae-population-trends.ja.ts': yonoKomaePopulationTrendsJa,
    // 'yono-komae-socioeconomic.ja.ts': yonoKomaeSocioeconomicJa,
    'city-name-origin.ja.ts': cityNameOriginJa,
  },
};

// Export all battles as an array
export const battleSeeds: Battle[] = Object.values(battleMap);

// Export battle map for file-based lookup
export const battleSeedsByFile = battleMap;

// Load battle by file name
export function loadBattleSeedByFile(file: string): Battle | undefined {
  return battleMap[file];
}

// Export all battles for discovery
export const allBattleSeeds = battleSeeds;
