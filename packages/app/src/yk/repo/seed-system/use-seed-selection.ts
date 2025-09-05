import { useContext } from 'react';
import { Ctx, type HistoricalSeedSelection } from './seed-context';

/**
 * Hook to access seed selection state from React context.
 *
 * **Purpose**:
 * Provides type-safe access to seed selection state and controls for components
 * that need to interact with the seed system.
 *
 * **Return Value**:
 * - **Inside Provider**: Returns HistoricalSeedSelection object with full functionality
 * - **Outside Provider**: Returns null for graceful degradation
 * - **State Access**: Current seed file, setter function, and rotation function
 *
 * **Usage Patterns**:
 * ```typescript
 * // Basic usage - get current seed selection
 * const seedSelection = useHistoricalSeedSelection();
 * const currentSeed = seedSelection?.seedFile; // 'battle.json' | undefined
 *
 * // Manual seed selection
 * const selectSpecificSeed = () => {
 *   seedSelection?.setSeedFile('edo-period.json');
 * };
 *
 * // Clear selection (use random)
 * const useRandomSeed = () => {
 *   seedSelection?.setSeedFile(undefined);
 * };
 *
 * // Rotate through available seeds
 * const nextSeed = () => {
 *   seedSelection?.rotateSeed();
 * };
 *
 * // Conditional rendering based on seed availability
 * if (!seedSelection) {
 *   return <div>Seed system not available</div>;
 * }
 * ```
 *
 * **Integration Points**:
 * - **Repository Integration**: Used by RepositoryProvider to pass seed to repositories
 * - **UI Components**: Seed selector dropdowns and rotation buttons use this hook
 * - **Battle Generation**: Repositories access selected seed for deterministic battles
 * - **State Synchronization**: Multiple components can share the same seed selection
 *
 * **Null Handling**:
 * Hook returns null when used outside HistoricalSeedProvider, enabling:
 * - Graceful degradation in components with optional seed support
 * - Conditional feature rendering based on seed system availability
 * - Testing scenarios without full provider setup
 * - Progressive enhancement patterns
 *
 * **Performance Considerations**:
 * - Hook leverages React's useContext optimization
 * - Context value memoization in provider prevents unnecessary re-renders
 * - Selective subscription to only the parts of state actually used
 *
 * **State Management Flow**:
 * 1. User selects seed via UI component using this hook
 * 2. Hook updates context state via setSeedFile
 * 3. RepositoryProvider automatically receives updated seed selection
 * 4. Repository uses seed for deterministic battle generation
 * 5. UI reflects current selection for user feedback
 *
 * **Error Boundary Behavior**:
 * - Hook itself cannot throw errors (returns null gracefully)
 * - State update functions are provided by context and may handle validation
 * - Consumer components should handle null return value appropriately
 *
 * @returns Current seed selection state and controls, or null if outside provider
 *
 * @see {@link HistoricalSeedSelection} for return type structure
 * @see {@link HistoricalSeedProvider} for context provider setup
 * @see {@link historicalSeeds} for available seed catalog
 */
export function useHistoricalSeedSelection(): HistoricalSeedSelection | null {
  return useContext(Ctx);
}
