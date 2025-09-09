import React, { use, useMemo } from 'react';
import type { PlayMode } from '@/yk/play-mode';
import type {
  BattleReportRepository,
  JudgementRepository,
} from './repositories';
import {
  getBattleReportRepository,
  getJudgementRepository,
} from './repository-provider';
import { RepoContext, type RepoContextValue } from './repository-context';
import { useHistoricalSeedSelection } from '../seed-system';

/**
 * React provider component for repository dependency injection.
 *
 * **Primary Provider Component**:
 * - Provides repository instances to React component tree
 * - Integrates with seed-system for context-aware repository configuration
 * - Uses lazy instantiation pattern for optimal performance
 * - Supports dynamic repository swapping based on PlayMode changes
 *
 * **Architecture Pattern**:
 * - **Factory Integration**: Uses repository factory functions for instance creation
 * - **Lazy Loading**: Repository instances created on-demand during method calls
 * - **Context Injection**: Provides instances via React context
 * - **Seed Integration**: Automatically integrates selected seed file from seed-system
 *
 * **Performance Optimizations**:
 * - Memoized context value to prevent unnecessary re-renders
 * - Dynamic imports in factory functions for code splitting
 * - Lazy repository instantiation to reduce initial load
 * - Dependency array optimization for stable context values
 *
 * **Seed System Integration**:
 * - Automatically accesses selected seed file from HistoricalSeedProvider
 * - Passes seed file to repository factory for seed-based repositories
 * - Respects user's seed selection for consistent battle generation
 *
 * **Usage**:
 * ```typescript
 * <RepositoryProvider mode={currentMode}>
 *   <BattleComponent />
 * </RepositoryProvider>
 * ```
 *
 * @param props Component properties
 * @param props.mode Optional PlayMode for repository selection
 * @param props.children React children to receive repository context
 *
 * @see {@link RepositoryProviderSuspense} for suspense-ready variant
 * @see {@link useRepositories} for consuming repository context
 * @see {@link useHistoricalSeedSelection} for seed-system integration
 */
export function RepositoryProvider({
  mode,
  children,
  seedFile,
}: {
  mode?: PlayMode;
  children: React.ReactNode;
  /** Optional explicit battle seed file (overrides historical seed system when provided) */
  seedFile?: string;
}) {
  const seedSelection = useHistoricalSeedSelection();
  const value = useMemo<RepoContextValue>(() => {
    // Lazily create and persist the underlying repository instance so that
    // any internal cache (e.g., TTL memoization) survives across calls.
    let repoPromise: Promise<BattleReportRepository> | null = null;
    const getOrCreateBattleReportRepo = async () => {
      if (!repoPromise) {
        let effectiveSeedFile = seedFile ?? seedSelection?.seedFile;
        // Loader expects file names with a leading slash when concatenated with root
        // (random selection produces values like '/celebrity-battle.ja.ts').
        // Normalize so a user-selected 'celebrity-battle.ja.ts' becomes '/celebrity-battle.ja.ts'.
        if (effectiveSeedFile && !effectiveSeedFile.startsWith('/')) {
          effectiveSeedFile = '/' + effectiveSeedFile;
        }
        if (process.env.NODE_ENV !== 'production') {
          console.debug(
            '[RepositoryProvider] battle seed file =',
            effectiveSeedFile,
          );
        }
        repoPromise = getBattleReportRepository(mode, effectiveSeedFile);
      }
      return repoPromise;
    };
    const battleReport = {
      generateReport: async (
        opts?: import('./repositories').GenerateBattleReportParams,
      ) => {
        const repo = await getOrCreateBattleReportRepo();
        return repo.generateReport(opts);
      },
    } as BattleReportRepository;
    const judgement = {
      determineWinner: async (
        input: Parameters<JudgementRepository['determineWinner']>[0],
        options?: Parameters<JudgementRepository['determineWinner']>[1],
      ) => {
        const repo = await getJudgementRepository(mode);
        return repo.determineWinner(input, options);
      },
    } as JudgementRepository;
    return { battleReport, judgement };
  }, [mode, seedSelection?.seedFile, seedFile]);

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
}

/**
 * Suspense-ready repository provider for async initialization scenarios.
 *
 * **React Suspense Integration**:
 * - Uses React 18 `use()` hook for suspense-ready async resolution
 * - Pre-initializes repository instances during render
 * - Enables React Suspense boundaries to handle loading states
 * - Provides fully resolved repository instances to children
 *
 * **Use Cases**:
 * - API repositories requiring upfront authentication
 * - Repository initialization with async configuration loading
 * - Complex repository dependencies requiring sequential setup
 * - Scenarios requiring guaranteed repository availability
 *
 * **Behavior Differences vs Standard Provider**:
 * - **Standard**: Lazy instantiation on method calls
 * - **Suspense**: Eager instantiation during provider initialization
 * - **Standard**: No loading UI integration
 * - **Suspense**: Works with React Suspense boundaries
 *
 * **Performance Considerations**:
 * - Higher initial cost due to upfront repository creation
 * - Better runtime performance with pre-initialized instances
 * - Works well with React Suspense loading patterns
 * - Ideal for scenarios where initialization cost is acceptable
 *
 * **Usage with Suspense**:
 * ```typescript
 * <Suspense fallback={<LoadingSpinner />}>
 *   <RepositoryProviderSuspense mode={currentMode}>
 *     <BattleComponent />
 *   </RepositoryProviderSuspense>
 * </Suspense>
 * ```
 *
 * @param props Component properties
 * @param props.mode Optional PlayMode for repository selection
 * @param props.children React children to receive repository context
 *
 * @see {@link RepositoryProvider} for standard lazy-loading variant
 * @see {@link initRepositories} for initialization implementation
 */
export function RepositoryProviderSuspense({
  mode,
  children,
}: {
  mode?: PlayMode;
  children: React.ReactNode;
}) {
  const promise = useMemo(() => initRepositories(mode), [mode]);
  const value = use(promise);
  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
}

/**
 * Initialize repository instances asynchronously for Suspense provider.
 *
 * **Parallel Initialization**:
 * - Concurrently initializes both battle report and judgement repositories
 * - Uses Promise.all for optimal performance
 * - Handles factory function async operations
 * - Returns complete context value when all repositories ready
 *
 * **Error Handling**:
 * - Repository initialization errors bubble up to React error boundaries
 * - Failed repository creation prevents provider initialization
 * - Ensures consistent state by requiring all repositories to succeed
 *
 * @param mode Optional PlayMode for repository selection
 * @returns Promise resolving to complete repository context value
 *
 * @internal
 */
async function initRepositories(mode?: PlayMode): Promise<RepoContextValue> {
  const [battleReport, judgement] = await Promise.all([
    getBattleReportRepository(mode),
    getJudgementRepository(mode),
  ]);
  return { battleReport, judgement };
}
