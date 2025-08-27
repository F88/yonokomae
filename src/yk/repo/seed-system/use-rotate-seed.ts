import { useCallback } from 'react';
import { useHistoricalSeedSelection } from '@/yk/repo/seed-system';

/**
 * Hook to rotate seed selection to the next available seed in the catalog.
 *
 * **Purpose**:
 * Provides a convenient interface for rotating through available seed files
 * in a cyclical manner, commonly used for "next seed" UI buttons.
 *
 * **Behavior**:
 * - **Cyclical Rotation**: Moves to next seed in catalog, wrapping to beginning at end
 * - **Start Position**: If no seed selected, starts from first available seed
 * - **Empty Catalog**: No-op when no seeds are available in catalog
 * - **Stable Reference**: Returns memoized callback to prevent unnecessary re-renders
 *
 * **Rotation Logic**:
 * ```typescript
 * // Current: undefined -> Next: first seed
 * // Current: 'seed-1.json' -> Next: 'seed-2.json'
 * // Current: 'last-seed.json' -> Next: 'first-seed.json' (wrap around)
 * ```
 *
 * **Usage Patterns**:
 * ```typescript
 * // UI button for cycling seeds
 * function NextSeedButton() {
 *   const rotateSeed = useRotateHistoricalSeed();
 *   return <button onClick={rotateSeed}>Next Seed</button>;
 * }
 *
 * // Keyboard shortcut integration
 * function BattleInterface() {
 *   const rotateSeed = useRotateHistoricalSeed();
 *
 *   useEffect(() => {
 *     const handleKeyPress = (e) => {
 *       if (e.key === 'n' && e.metaKey) rotateSeed();
 *     };
 *     document.addEventListener('keydown', handleKeyPress);
 *     return () => document.removeEventListener('keydown', handleKeyPress);
 *   }, [rotateSeed]);
 * }
 *
 * // Auto-rotation timer
 * function AutoRotatingDemo() {
 *   const rotateSeed = useRotateHistoricalSeed();
 *
 *   useEffect(() => {
 *     const interval = setInterval(rotateSeed, 5000);
 *     return () => clearInterval(interval);
 *   }, [rotateSeed]);
 * }
 * ```
 *
 * **Performance Optimization**:
 * - Returns memoized callback to prevent parent component re-renders
 * - Callback reference remains stable unless context changes
 * - Efficient dependency tracking with minimal re-computation
 *
 * **Integration with Context**:
 * - Delegates rotation logic to HistoricalSeedProvider's rotateSeed function
 * - Maintains consistency with provider's catalog and state management
 * - Respects provider's empty catalog handling and error recovery
 *
 * **Error Handling**:
 * - Gracefully handles null context (when used outside provider)
 * - No-op behavior when seed catalog is empty or unavailable
 * - Safe to call repeatedly without side effects
 *
 * **State Impact**:
 * - Updates global seed selection state in HistoricalSeedProvider
 * - Triggers re-renders in components using useHistoricalSeedSelection
 * - Automatically propagates to RepositoryProvider for battle generation
 *
 * @returns Memoized function to rotate to next available seed
 *
 * @see {@link useHistoricalSeedSelection} for direct seed selection access
 * @see {@link HistoricalSeedProvider} for rotation logic implementation
 * @see {@link historicalSeeds} for available seed catalog
 */
export function useRotateHistoricalSeed() {
  const ctx = useHistoricalSeedSelection();
  return useCallback(() => {
    ctx?.rotateSeed();
  }, [ctx]);
}
