import type { Battle } from '@yonokomae/types';

// Import all news sample seeds
import newsSample1 from './samples/news-sample-1';
import newsSample2 from './samples/news-sample-2';
import newsSampleLocalCuisineShowdown from './samples/news-sample-local-cuisine-showdown';

// Collect all news seeds in a map
const newsSeedMap: Record<string, Battle> = {
  'news-sample-1.ts': newsSample1,
  'news-sample-2.ts': newsSample2,
  'news-sample-local-cuisine-showdown.ts': newsSampleLocalCuisineShowdown,
};

// Export all news seeds as an array
export const newsSeeds: Battle[] = Object.values(newsSeedMap);

// Export news seed map for file-based lookup
export const newsSeedsByFile = newsSeedMap;

// Load news seed by file name
export function loadNewsSeedByFile(file: string): Battle | undefined {
  return newsSeedMap[file];
}

// Export all news seeds for discovery
export const allNewsSeeds = newsSeeds;
