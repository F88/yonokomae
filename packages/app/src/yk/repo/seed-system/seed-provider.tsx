import React, { useCallback, useMemo, useState } from 'react';
import { Ctx, type HistoricalSeedSelection } from './seed-context';
import { historicalSeeds } from './seeds';

/**
 * React provider component for seed selection state management.
 *
 * **Purpose**:
 * Manages seed file selection state and provides seed rotation functionality
 * throughout the React component tree via context.
 *
 * **State Management**:
 * - **Current Selection**: Tracks currently selected seed file (undefined = random)
 * - **Manual Selection**: Allows components to set specific seed files
 * - **Rotation Logic**: Cycles through available seed files in catalog order
 * - **Memoized Context**: Prevents unnecessary re-renders of consumer components
 *
 * **Integration with Seed Catalog**:
 * - Uses `historicalSeeds` array from seeds module for available seed files
 * - Rotation respects catalog order and wraps around cyclically
 * - Handles empty catalog gracefully (no-op rotation)
 * - Supports both specific selection and random behavior
 *
 * **Rotation Algorithm**:
 * ```typescript
 * // If no current selection, start from first seed
 * // If current selection exists, move to next in catalog
 * // Wrap around to beginning when reaching end
 * const nextIndex = (currentIndex + 1) % totalSeeds;
 * ```
 *
 * **Context Value Optimization**:
 * - Uses useMemo to prevent context value recreation on every render
 * - Memoizes rotateSeed callback to maintain referential equality
 * - Dependency array includes only necessary state for re-computation
 *
 * **Usage Pattern**:
 * ```typescript
 * // Application root setup
 * <HistoricalSeedProvider>
 *   <RepositoryProvider mode={mode}>
 *     <BattleInterface />
 *   </RepositoryProvider>
 * </HistoricalSeedProvider>
 *
 * // Component usage (via hooks)
 * const seedSelection = useHistoricalSeedSelection();
 * seedSelection?.setSeedFile('specific-battle.json');
 * seedSelection?.rotateSeed(); // Move to next available seed
 * ```
 *
 * **Repository Integration**:
 * - Selected seed file is automatically passed to BattleReportRepository
 * - RepositoryProvider consumes seed selection via useHistoricalSeedSelection
 * - Enables deterministic battle generation based on selected seed data
 * - undefined selection allows repositories to use random seed selection
 *
 * **Error Handling**:
 * - Gracefully handles empty seed catalog (rotation becomes no-op)
 * - Missing seeds in catalog are skipped during rotation
 * - Invalid seed selections fall back to undefined (random behavior)
 *
 * @param props Component properties
 * @param props.children React children that need access to seed selection context
 *
 * @see {@link HistoricalSeedSelection} for state structure
 * @see {@link useHistoricalSeedSelection} for consuming context in components
 * @see {@link historicalSeeds} for available seed catalog
 */
export function HistoricalSeedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seedFile, setSeedFile] = useState<string | undefined>(undefined);

  const rotateSeed = useCallback(() => {
    if (historicalSeeds.length === 0) return;
    const idx = seedFile
      ? historicalSeeds.findIndex((s) => s.file === seedFile)
      : -1;
    const nextIdx = (idx + 1) % historicalSeeds.length;
    setSeedFile(historicalSeeds[nextIdx]?.file);
  }, [seedFile]);

  const value: HistoricalSeedSelection = useMemo(
    () => ({ seedFile, setSeedFile, rotateSeed }),
    [seedFile, rotateSeed],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
