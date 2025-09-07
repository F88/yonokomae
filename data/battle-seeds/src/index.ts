import type { Battle } from '@yonokomae/types';

import adjacentMunicipalitiesJa from './battle/adjacent-municipalities.ja';
import agricultureJa from './battle/agriculture.ja';
import aiOracle from './battle/ai-oracle.ja';
import ancientLifeBattle from './battle/ancient-life-battle.ja';
import areaComparisonJa from './battle/area-comparison.ja';
import celebrityBattle from './battle/celebrity-battle.ja';
import childSafetyBattle from './battle/child-safety-battle.ja';
import cityNameOriginJa from './battle/city-name-origin.ja';
import civicTechBattle from './battle/civic-tech-battle.ja';
import coderDojoBattle from './battle/coder-dojo-battle.ja';
import commutingFlowsJa from './battle/commuting-flows.ja';
import cultureBattle from './battle/culture-battle.ja';
import dataGhostHunt from './battle/data-ghost-hunt.ja';
import densityBattle from './battle/density-battle.ja';
import developmentBattle from './battle/development-battle.ja';
import disasterSimulationBattle from './battle/disaster-simulation-battle.ja';
import edoEraHeroes from './battle/edo-era-heroes.ja';
import fisheriesJa from './battle/fisheries.ja';
import floodBattle from './battle/flood-battle.ja';
import geomorphologyHydrologyJa from './battle/geomorphology-hydrology.ja';
import hwmbKomaeJa from './battle/hwmb-komae-independence.ja';
import hwmbYK from './battle/hwmb-merger-and-independence.ja';
import hwmbYonoJa from './battle/hwmb-merger-of-glory.ja';
import ikadaRace from './battle/ikada-race.ja';
import industryGrowthJa from './battle/industry-growth.ja';
import kidsTechBattle from './battle/kids-tech-battle.ja';
import localCurrencyBattle from './battle/local-currency-battle.ja';
import meteorologyJa from './battle/meteorology.ja';
import parentingRobotsBattle from './battle/parenting-robot-battle.ja';
import populationTrendsJa from './battle/population-trends.ja';
import robotEthics from './battle/robot-ethics.ja';
import ruinsBattle from './battle/ruins-battle.ja';
import sengokuTerritory from './battle/sengoku-territory.ja';
import showaSuperstarBattle from './battle/showa-superstar-battle.ja';
import snackBattle from './battle/snack-battle.ja';
import snsTruthVsLies from './battle/sns-truth-vs-lies.ja';
import socioeconomicJa from './battle/socioeconomic.ja';
import transportationHubBattle from './battle/transportation-hub-battle.ja';
import undergroundConspiracy from './battle/underground-conspiracy.ja';
import waterResourceManagementBattle from './battle/water-resource-battle.ja';
import wikipediaJaBattle from './battle/wikipedia-ja-battle.ja';

// Collect all battles in a map
const battleMap: Record<string, Battle> = {
  ...{
    // Legendary battles
    'hwmb-yk.ja.ts': hwmbYK,
    'hwmb-yono.ja.ts': hwmbYonoJa,
    'hwmb-komae.ja.ts': hwmbKomaeJa,
  },
  ...{
    'yono-komae-adjacent-municipalities.ja.ts': adjacentMunicipalitiesJa,
    'yono-komae-agriculture.ja.ts': agricultureJa,
    'yono-komae-area-comparison.ja.ts': areaComparisonJa,
    'yono-komae-commuting-flows.ja.ts': commutingFlowsJa,
    'yono-komae-fisheries.ja.ts': fisheriesJa,
    'yono-komae-geomorphology-hydrology.ja.ts': geomorphologyHydrologyJa,
    'yono-komae-industry-growth.ja.ts': industryGrowthJa,
    'yono-komae-meteorology.ja.ts': meteorologyJa,
    'yono-komae-population-trends.ja.ts': populationTrendsJa,
    'yono-komae-socioeconomic.ja.ts': socioeconomicJa,
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
    'snack-battle.ja.ts': snackBattle,
    'kids-tech-battle.ja.ts': kidsTechBattle,
    'ai-oracle.ja.ts': aiOracle,
    'data-ghost-hunt.ja.ts': dataGhostHunt,
    'child-safety-battle.ja.ts': childSafetyBattle,
    'disaster-simulation-battle.ja.ts': disasterSimulationBattle,
    'parenting-robot-battle.ja.ts': parentingRobotsBattle,
    'water-resource-battle.ja.ts': waterResourceManagementBattle,
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
