import type { Battle } from '@yonokomae/types';

// Import all battle seeds of HWMB
import hwmbYK from './battle/hwmb-merger-and-independence.ja';
import hwmbYonoJa from './battle/hwmb-merger-of-glory.ja';
import hwmbKomaeJa from './battle/hwmb-komae-independence.ja';

// Import all battle seeds of after HWMB
// import yonoKomaeAdjacentMunicipalitiesJa from './battle/yono-komae-adjacent-municipalities.ja.js';
// import yonoKomaeAgricultureJa from './battle/yono-komae-agriculture.ja.js';
// import yonoKomaeAreaComparisonJa from './battle/yono-komae-area-comparison.ja.js';
// import yonoKomaeCommutingFlowsJa from './battle/yono-komae-commuting-flows.ja.js';
import yonoKomaeFisheriesJa from './battle/yono-komae-fisheries.ja';
import yonoKomaeGeomorphologyHydrologyJa from './battle/yono-komae-geomorphology-hydrology.ja';
import yonoKomaeIndustryGrowthJa from './battle/yono-komae-industry-growth.ja';
// import yonoKomaeMeteorologyJa from './battle/yono-komae-meteorology.ja.js';
// import yonoKomaePopulationTrendsJa from './battle/yono-komae-population-trends.ja.js';
// import yonoKomaeSocioeconomicJa from './battle/yono-komae-socioeconomic.ja.js';
import cityNameOriginJa from './battle/city-name-origin.ja';

// Import new battle files
import celebrityBattle from './battle/celebrity-battle.ja';
import showaSuperstarBattle from './battle/showa-superstar-battle.ja';
import edoEraHeroes from './battle/edo-era-heroes.ja';
import sengokuTerritory from './battle/sengoku-territory.ja';
import ancientLifeBattle from './battle/ancient-life-battle.ja';
import ruinsBattle from './battle/ruins-battle.ja';
import developmentBattle from './battle/development-battle.ja';
import floodBattle from './battle/flood-battle.ja';
import transportationHubBattle from './battle/transportation-hub-battle.ja';
import cultureBattle from './battle/culture-battle.ja';
import densityBattle from './battle/density-battle.ja';
import ikadaRace from './battle/ikada-race.ja';
import civicTechBattle from './battle/civic-tech-battle.ja';
import coderDojoBattle from './battle/coder-dojo-battle.ja';
import robotEthics from './battle/robot-ethics.ja';
import snsTruthVsLies from './battle/sns-truth-vs-lies.ja';
import wikipediaJaBattle from './battle/wikipedia-ja-battle.ja';
import undergroundConspiracy from './battle/underground-conspiracy.ja';
import localCurrencyBattle from './battle/local-currency-battle.ja';

// Collect all battles in a map
const battleMap: Record<string, Battle> = {
  ...{
    // Legendary battles
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
  ...{
    // New battle files
    'celebrity-battle.ja.ts': celebrityBattle,
    'showa-superstar-battle.ja.ts': showaSuperstarBattle,
    'edo-era-heroes.ja.ts': edoEraHeroes,
    'sengoku-territory.ja.ts': sengokuTerritory,
    'ancient-life-battle.ja.ts': ancientLifeBattle,
    'ruins-battle.ja.ts': ruinsBattle,
    'development-battle.ja.ts': developmentBattle,
    'flood-battle.ja.ts': floodBattle,
    'transportation-hub-battle.ja.ts': transportationHubBattle,
    'culture-battle.ja.ts': cultureBattle,
    'density-battle.ja.ts': densityBattle,
    'ikada-race.ja.ts': ikadaRace,
    'civic-tech-battle.ja.ts': civicTechBattle,
    'coder-dojo-battle.ja.ts': coderDojoBattle,
    'robot-ethics.ja.ts': robotEthics,
    'sns-truth-vs-lies.ja.ts': snsTruthVsLies,
    'wikipedia-ja-battle.ja.ts': wikipediaJaBattle,
    'underground-conspiracy.ja.ts': undergroundConspiracy,
    'local-currency-battle.ja.ts': localCurrencyBattle,
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
