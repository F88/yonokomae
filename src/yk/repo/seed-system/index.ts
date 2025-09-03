/**
 * Seed System Module - Battle Scenario Seed Management
 *
 * **Core Purpose**:
 * Provides a centralized system for managing battle scenario seed files that contain
 * curated historical data, narratives, and character information for battle generation.
 *
 * **Architecture Overview**:
 * - **React Context Pattern**: Distributes seed selection state throughout component tree
 * - **Provider Component**: Manages seed file discovery and user selection
 * - **Custom Hooks**: Provide type-safe access to seed data and selection logic
 * - **Automatic Discovery**: Uses Vite glob imports to discover seed files at build time
 * - **File System Integration**: Supports both JSON and TypeScript seed formats
 *
 * **Seed File Structure**:
 * Seed files are located in `/seeds/random-data/scenario/` and contain:
 * - Battle narratives with historical context
 * - Titles, subtitles, and overview text
 * - Provenance information with source references
 * - Support for multilingual content (EN/JA variants)
 *
 * **Primary API**:
 * ```typescript
 * // Provider setup (wrap your app)
 * <SeedProvider>
 *   <BattleInterface />
 * </SeedProvider>
 *
 * // Hook usage in components
 * const seedSelection = useSeedSelection();
 * const seedFile = seedSelection?.seedFile; // Currently selected seed
 *
 * // Repository integration (automatic via RepositoryProvider)
 * const battleRepo = await getBattleReportRepository(mode, seedFile);
 * ```
 *
 * **Integration Points**:
 * - **RepositoryProvider**: Automatically passes selected seed to repositories
 * - **HistoricalEvidencesBattleReportRepository**: Uses seed files for scenario generation
 * - **PlayMode Integration**: Different modes can use seed system differently
 * - **User Selection**: UI components allow users to choose specific seed files
 *
 * **File Discovery Process**:
 * 1. Build-time glob import discovers all seed files
 * 2. Files are validated and cataloged with metadata
 * 3. Provider makes catalog available to React components
 * 4. Users can select specific seeds via UI or use random selection
 *
 * **Backward Compatibility**:
 * Maintains legacy "Historical" naming for existing code while providing
 * cleaner API surface via re-exports.
 *
 * @module SeedSystem
 * @see {@link SeedProvider} for React context provider
 * @see {@link useSeedSelection} for accessing seed selection state
 * @see {@link seeds} module for seed file discovery and loading
 */

// Primary API exports with clean naming
export { HistoricalSeedProvider as SeedProvider } from './seed-provider';
export { useHistoricalSeedSelection as useSeedSelection } from './use-seed-selection';
export type { HistoricalSeedSelection as SeedSelection } from './seed-context';
export { Ctx as SeedContext } from './seed-context';
export * from './seeds';

// Backward compatibility exports (maintain legacy "Historical" naming)
export { HistoricalSeedProvider } from './seed-provider';
export { useHistoricalSeedSelection } from './use-seed-selection';
export type { HistoricalSeedSelection } from './seed-context';
export { Ctx } from './seed-context';
