export type HistoricalSeedMeta = {
  id: string;
  title: string;
  file: string; // relative path under seeds/historical
};

export const historicalSeeds: HistoricalSeedMeta[] = [
  {
    id: 'tama-river-001',
    title: 'Battle of Tama River',
    file: 'tama-river.json',
  },
  {
    id: 'bridge-skirmish-002',
    title: 'Skirmish at the Old Bridge',
    file: 'bridge-skirmish.json',
  },
];

export type HistoricalSeed = {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  narrative: string;
  provenance?: Array<{ label: string; url?: string; note?: string }>;
};

export async function loadSeedByFile(
  file: string,
): Promise<{ default: HistoricalSeed }> {
  // Use Vite's import.meta.glob for predictable dynamic imports
  const modules = import.meta.glob('../../seeds/historical/*.json');
  const key = `../../seeds/historical/${file}`;
  const loader = modules[key] as
    | (() => Promise<{ default: HistoricalSeed }>)
    | undefined;
  if (!loader) {
    throw new Error(`Seed not found: ${file}`);
  }
  return loader();
}

let selectedSeedFile: string | undefined;
export function setSelectedSeedFile(file?: string): void {
  selectedSeedFile = file;
}
export function getSelectedSeedFile(): string | undefined {
  return selectedSeedFile;
}
export function rotateSelectedSeed(): string | undefined {
  if (historicalSeeds.length === 0) return undefined;
  const idx = selectedSeedFile
    ? historicalSeeds.findIndex((s) => s.file === selectedSeedFile)
    : -1;
  const nextIdx = (idx + 1) % historicalSeeds.length;
  selectedSeedFile = historicalSeeds[nextIdx]?.file;
  return selectedSeedFile;
}
