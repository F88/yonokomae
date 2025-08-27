import { createContext } from 'react';

/**
 * Seed Selection State Interface
 *
 * **Purpose**: Defines the shape of seed selection state and controls for the seed system.
 *
 * **State Management**:
 * - Tracks currently selected seed file (optional)
 * - Provides setter function for manual seed selection
 * - Includes rotation function for cycling through available seeds
 *
 * **Usage Patterns**:
 * ```typescript
 * // Get current selection
 * const currentSeed = selection?.seedFile; // 'battle-scenario.json' or undefined
 *
 * // Set specific seed
 * selection?.setSeedFile('tama-river.json');
 *
 * // Clear selection (use random)
 * selection?.setSeedFile(undefined);
 *
 * // Rotate to next seed
 * selection?.rotateSeed();
 * ```
 *
 * **Integration with Repositories**:
 * - Seed file is automatically passed to BattleReportRepository via RepositoryProvider
 * - undefined seedFile results in random seed selection from available catalog
 * - Enables deterministic battle generation when specific seed is selected
 *
 * **File Format**:
 * Seed files are discovered from `/seeds/random-data/scenario/` directory:
 * - JSON files: `*.json`
 * - TypeScript files: `*.en.ts`, `*.ja.ts`, `*.ts`
 * - Example: `'tama-river.json'`, `'edo-period.en.ts'`
 *
 * @see {@link SeedProvider} for state management implementation
 * @see {@link useSeedSelection} for consuming this state in components
 */
export type HistoricalSeedSelection = {
  /** Currently selected seed file name (undefined = random selection) */
  seedFile?: string; // e.g., 'tama-river.json'
  /** Set specific seed file or clear selection for random */
  setSeedFile: (file?: string) => void;
  /** Rotate to next available seed in catalog */
  rotateSeed: () => void;
};

/**
 * React context for seed selection state distribution.
 *
 * **Context Provider Pattern**:
 * - Distributes seed selection state throughout React component tree
 * - Eliminates prop drilling for seed-related functionality
 * - Enables centralized seed management with local component access
 * - Supports both controlled and uncontrolled seed selection patterns
 *
 * **Lifecycle**:
 * - Context value is created by SeedProvider component
 * - Provider discovers available seed files and manages selection state
 * - Consumer components access state via useSeedSelection hook
 * - State changes trigger re-renders in dependent components and repositories
 *
 * **Null State**:
 * Context value is null when used outside SeedProvider, enabling graceful
 * degradation in components that optionally use seed system.
 *
 * @see {@link HistoricalSeedSelection} for state structure
 * @see {@link SeedProvider} for context provider implementation
 */
export const Ctx = createContext<HistoricalSeedSelection | null>(null);
