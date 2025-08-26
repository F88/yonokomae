export type HistoricalSeedMeta = {
  id: string;
  title: string;
  file: string; // relative path under seeds/historical-evidence/scenario
};

// Discover seed modules at build time (both JSON under /seeds and TS under /src/seeds)
const discoveredSeedModules = {
  ...import.meta.glob('/seeds/historical-evidence/scenario/*.json', {
    eager: true,
  }),
  ...import.meta.glob('/src/seeds/historical-evidence/scenario/*.ts', {
    eager: true,
  }),
};

function basename(path: string): string {
  const m = path.match(/([^/]+)\.json$/);
  return m ? m[1] : path;
}

type SeedModule = { default: HistoricalSeed };

const metas: HistoricalSeedMeta[] = Object.keys(discoveredSeedModules)
  .sort()
  .map((absPath) => {
    const mod = discoveredSeedModules[absPath] as unknown as SeedModule;
    const isSrcTs = absPath.startsWith(
      '/src/seeds/historical-evidence/scenario/',
    );
    const file = isSrcTs
      ? absPath.replace('/src/seeds/historical-evidence/scenario/', '')
      : absPath.replace('/seeds/historical-evidence/scenario/', '');
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
  // Static-only resolution (no dynamic import) to avoid mixed static/dynamic warnings
  const modules = {
    ...import.meta.glob('/seeds/historical-evidence/scenario/*.json', {
      eager: true,
    }),
    ...import.meta.glob('/src/seeds/historical-evidence/scenario/*.ts', {
      eager: true,
    }),
  } as Record<string, unknown>;
  const keyJson = `/seeds/historical-evidence/scenario/${file}`;
  const keyTs = `/src/seeds/historical-evidence/scenario/${file}`;
  const mod = (modules[keyJson] ?? modules[keyTs]) as
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
