/**
 * Seed metadata containing essential information for seed catalog and selection.
 *
 * **Structure**:
 * - **id**: Unique identifier for the seed (used for deduplication)
 * - **title**: Human-readable name for UI display
 * - **file**: Relative path from seed directory for loading
 *
 * **Usage**:
 * Used by seed selection UI and provider for catalog management.
 */
export type HistoricalSeedMeta = {
  /** Unique identifier for the seed */
  id: string;
  /** Human-readable title for UI display */
  title: string;
  /** Relative file path under seeds/random-data/scenario/ */
  file: string;
};

/**
 * Build-time seed module discovery using Vite glob imports.
 *
 * **Discovery Process**:
 * - **JSON Seeds**: `/seeds/random-data/scenario/*.json`
 * - **TypeScript Seeds**: `/src/seeds/random-data/scenario/*.{en,ja}.ts`
 * - **Eager Loading**: All modules loaded at build time for optimal performance
 * - **Static Analysis**: Enables tree shaking and build-time validation
 *
 * **Supported Formats**:
 * - JSON files with HistoricalSeed data structure
 * - TypeScript modules exporting default HistoricalSeed
 * - Multilingual variants (en.ts, ja.ts) for localization
 *
 * **Build Integration**:
 * - Vite glob imports provide type safety and static analysis
 * - Build fails early if seed files are malformed or missing
 * - Enables bundler optimization through static module graph
 */
const discoveredSeedModules = {
  ...import.meta.glob('/seeds/random-data/scenario/*.json', { eager: true }),
  ...import.meta.glob('/src/seeds/random-data/scenario/*.{en,ja}.ts', {
    eager: true,
  }),
};

/**
 * Extract base filename from file path for fallback naming.
 *
 * **Purpose**: Provides default id/title when seed doesn't specify them.
 *
 * @param path File path to extract basename from
 * @returns Base filename without extension
 *
 * @internal
 */
function basename(path: string): string {
  const m = path.match(/([^/]+)\.(json|ts)$/);
  return m ? m[1] : path;
}

/**
 * Complete seed data structure containing battle scenario information.
 *
 * **Core Content**:
 * - **Identification**: Unique id and descriptive title
 * - **Narrative Elements**: Title, subtitle, overview, and full narrative
 * - **Attribution**: Optional provenance array with source references
 *
 * **Data Sources**:
 * Used by BattleReportRandomDataRepository to generate rich battle scenarios
 * with historical context and proper source attribution.
 *
 * **Provenance Structure**:
 * Each provenance entry can include:
 * - **label**: Human-readable source description
 * - **url**: Optional link to original source
 * - **note**: Additional context or citation information
 */
export type HistoricalSeed = {
  /** Unique identifier for the seed */
  id: string;
  /** Battle title for display */
  title: string;
  /** Battle subtitle or tagline */
  subtitle: string;
  /** Brief overview of the scenario */
  overview: string;
  /** Full narrative text with rich details */
  narrative: string;
  /** Optional source attribution and references */
  provenance?: Array<{ label: string; url?: string; note?: string }>;
};

/**
 * TypeScript module structure for seed imports.
 *
 * @internal
 */
type SeedModule = { default: HistoricalSeed };

/**
 * Build catalog of available seed metadata from discovered modules.
 *
 * **Processing Steps**:
 * 1. Sort discovered modules for consistent ordering
 * 2. Extract file path relative to seed directory
 * 3. Load id and title from seed content (with fallbacks)
 * 4. Build metadata catalog for provider consumption
 *
 * **Path Normalization**:
 * - Handles both `/seeds/` and `/src/seeds/` prefixes
 * - Maintains relative paths for loadSeedByFile compatibility
 * - Preserves file extensions for proper module resolution
 */
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

/**
 * Build-time validation to prevent duplicate seed IDs.
 *
 * **Validation Process**:
 * - Groups seeds by ID to detect conflicts
 * - Generates detailed error message with affected files
 * - Fails build early with clear resolution guidance
 * - Prevents runtime conflicts and data corruption
 *
 * **Error Format**:
 * ```
 * Duplicate HistoricalSeed ids detected. Make each seed id unique.
 * - id: battle-scenario
 *   files:
 *     - battle-scenario.json
 *     - battle-scenario.en.ts
 * ```
 *
 * **Resolution**:
 * Each seed file must have a unique ID field to prevent conflicts.
 */
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

/**
 * Read-only catalog of all discovered seed metadata.
 *
 * **Purpose**:
 * Central registry of available seed files for use by provider and UI components.
 *
 * **Content**:
 * - All successfully discovered and validated seed files
 * - Sorted by file path for consistent ordering
 * - Immutable array to prevent accidental modification
 * - Available at import time for synchronous access
 *
 * **Usage**:
 * ```typescript
 * // Provider setup
 * const seedCount = historicalSeeds.length;
 *
 * // UI seed selector
 * const seedOptions = historicalSeeds.map(seed => ({
 *   value: seed.file,
 *   label: seed.title
 * }));
 *
 * // Random seed selection
 * const randomSeed = historicalSeeds[Math.floor(Math.random() * historicalSeeds.length)];
 * ```
 *
 * @see {@link loadSeedByFile} for loading full seed content
 * @see {@link HistoricalSeedMeta} for metadata structure
 */
export const historicalSeeds: ReadonlyArray<HistoricalSeedMeta> = metas;

/**
 * Load complete seed data by file path.
 *
 * **Purpose**:
 * Resolves seed metadata file reference to full HistoricalSeed content
 * for use in battle generation and narrative display.
 *
 * **File Resolution**:
 * - Tries both `/seeds/` and `/src/seeds/` prefixes
 * - Handles both JSON and TypeScript module formats
 * - Normalizes module export patterns (default export vs direct export)
 * - Provides clear error messages for missing files
 *
 * **Module Format Support**:
 * ```typescript
 * // JSON format
 * {
 *   "id": "battle-id",
 *   "title": "Battle Title",
 *   // ... rest of HistoricalSeed
 * }
 *
 * // TypeScript default export
 * export default {
 *   id: "battle-id",
 *   title: "Battle Title",
 *   // ... rest of HistoricalSeed
 * } satisfies HistoricalSeed;
 *
 * // TypeScript direct export
 * export const id = "battle-id";
 * export const title = "Battle Title";
 * // ... rest of HistoricalSeed
 * ```
 *
 * **Error Handling**:
 * - Throws descriptive error for missing files
 * - Handles malformed modules gracefully
 * - Provides file path context in error messages
 *
 * **Performance**:
 * - Uses eager imports for build-time optimization
 * - No dynamic imports to avoid runtime resolution costs
 * - Static module graph for better bundler analysis
 *
 * @param file Relative file path from historicalSeeds catalog
 * @returns Promise resolving to normalized seed module with default export
 * @throws Error if file not found or malformed
 *
 * @see {@link historicalSeeds} for available file paths
 * @see {@link HistoricalSeed} for expected data structure
 */
export async function loadSeedByFile(
  file: string,
): Promise<{ default: HistoricalSeed }> {
  // Static-only resolution (no dynamic import) to avoid mixed static/dynamic warnings
  const modules = {
    ...import.meta.glob('/seeds/random-data/scenario/*.json', { eager: true }),
    ...import.meta.glob('/src/seeds/random-data/scenario/*.{en,ja}.ts', {
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
