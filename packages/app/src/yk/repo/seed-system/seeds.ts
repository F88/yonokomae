import type { HistoricalSeed, HistoricalSeedMeta } from '@yonokomae/types';
import {
  historicalSeedMetas as importedMetas,
  loadSeedByFile as importedLoadSeed,
} from '@yonokomae/data-historical-evidence';

// Re-export types for backward compatibility
export type { HistoricalSeed, HistoricalSeedMeta };

// Use static imports from data package
const metas: HistoricalSeedMeta[] = importedMetas;

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
 * - Uses static imports from @yonokomae/data-historical-evidence package
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
  const seed = importedLoadSeed(file);
  if (!seed) throw new Error(`Seed not found: ${file}`);
  return Promise.resolve({ default: seed });
}
