export type HistoricalSeedMeta = {
  id: string;
  title: string;
  file: string; // relative path under seeds/random-data/scenario
};

// Discover seed modules at build time (random-data only)
const discoveredSeedModules = {
  ...import.meta.glob('/seeds/random-data/scenario/*.json', { eager: true }),
  ...import.meta.glob('/src/seeds/random-data/scenario/*.ts', { eager: true }),
};

function basename(path: string): string {
  const m = path.match(/([^/]+)\.(json|ts)$/);
  return m ? m[1] : path;
}

export type HistoricalSeed = {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  narrative: string;
  provenance?: Array<{ label: string; url?: string; note?: string }>;
};

type SeedModule = { default: HistoricalSeed };

const metas: HistoricalSeedMeta[] = Object.keys(discoveredSeedModules)
  .sort()
  .map((absPath) => {
    const mod = discoveredSeedModules[absPath] as unknown as SeedModule;
    const isSrcTs = absPath.startsWith('/src/seeds/random-data/scenario/');
    const file = isSrcTs
      ? absPath.replace('/src/seeds/random-data/scenario/', '')
      : absPath.replace('/seeds/random-data/scenario/', '');
    const id = mod?.default?.id || basename(file);
    const title = mod?.default?.title || basename(file);
    return { id, title, file } satisfies HistoricalSeedMeta;
  });

// Detect duplicate IDs early and fail build with a clear message
(() => {
  const byId = new Map<string, string[]>();
  for (const m of metas) {
    const arr = byId.get(m.id) ?? [];
    arr.push(m.file);
    byId.set(m.id, arr);
  }
  const dups: Array<{ id: string; files: string[] }> = [];
  for (const [id, files] of byId) {
    if (files.length > 1) dups.push({ id, files });
  }
  if (dups.length > 0) {
    const lines = dups
      .map((d) => `- id: ${d.id}\n  files:\n    - ${d.files.join('\n    - ')}`)
      .join('\n');
    throw new Error(
      `Duplicate HistoricalSeed ids detected. Make each seed id unique.\n${lines}`,
    );
  }
})();

export const historicalSeeds: ReadonlyArray<HistoricalSeedMeta> = metas;

export async function loadSeedByFile(
  file: string,
): Promise<{ default: HistoricalSeed }> {
  // Static-only resolution (no dynamic import) to avoid mixed static/dynamic warnings
  const modules = {
    ...import.meta.glob('/seeds/random-data/scenario/*.json', { eager: true }),
    ...import.meta.glob('/src/seeds/random-data/scenario/*.ts', {
      eager: true,
    }),
  } as Record<string, unknown>;
  const keyJsonNew = `/seeds/random-data/scenario/${file}`;
  const keyTsNew = `/src/seeds/random-data/scenario/${file}`;
  const mod = (modules[keyJsonNew] ?? modules[keyTsNew]) as
    | { default?: HistoricalSeed }
    | HistoricalSeed
    | undefined;
  if (!mod) throw new Error(`Seed not found: ${file}`);
  function hasDefault(x: unknown): x is { default?: HistoricalSeed } {
    return (
      !!x &&
      typeof x === 'object' &&
      'default' in (x as Record<string, unknown>)
    );
  }
  const normalized = hasDefault(mod)
    ? mod.default
    : (mod as HistoricalSeed | undefined);
  if (!normalized) throw new Error(`Seed not found: ${file}`);
  return Promise.resolve({ default: normalized });
}
