import { createContext, useContext } from 'react';
import type {
  BattleReportRepository,
  JudgementRepository,
} from './repositories';

/**
 * Repository context value containing configured repository instances.
 *
 * **Dependency Injection Container**:
 * - Provides configured repository instances throughout React component tree
 * - Encapsulates PlayMode-specific repository selection
 * - Enables testing with mock repository injection
 * - Supports repository swapping without component changes
 *
 * **Repository Instances**:
 * - `battleReport`: Battle generation and data retrieval
 * - `judgement`: Battle outcome determination and judging
 *
 * **Lifecycle**:
 * - Created by RepositoryProvider based on PlayMode configuration
 * - Injected into React context for component consumption
 * - Available throughout component subtree via hooks
 */
export type RepoContextValue = {
  /** Repository for battle report generation and retrieval */
  battleReport: BattleReportRepository;
  /** Repository for battle outcome determination */
  judgement: JudgementRepository;
};

/**
 * React context for repository dependency injection.
 *
 * **Context Provider Pattern**:
 * - Distributes repository instances throughout component tree
 * - Eliminates prop drilling for repository dependencies
 * - Enables centralized repository configuration
 * - Supports context-aware repository selection
 *
 * **Usage**:
 * - Set by RepositoryProvider component
 * - Consumed by useRepositories/useRepositoriesOptional hooks
 * - Available in all child components
 *
 * @see {@link RepoContextValue} for context value structure
 * @see RepositoryProvider for context provider implementation
 */
export const RepoContext = createContext<RepoContextValue | null>(null);

/**
 * Hook to access repository instances from React context.
 *
 * **Required Context Hook**:
 * - Throws error if used outside RepositoryProvider
 * - Guarantees non-null repository instances
 * - Provides type-safe access to repositories
 * - Ideal for components that require repositories
 *
 * **Usage Pattern**:
 * ```typescript
 * function BattleComponent() {
 *   const { battleReport, judgement } = useRepositories();
 *
 *   const generateBattle = async () => {
 *     const battle = await battleReport.generateReport();
 *     const verdict = await judgement.determineWinner({
 *       mode,
 *       yono: battle.yono,
 *       komae: battle.komae
 *     });
 *   };
 * }
 * ```
 *
 * @returns Repository context value with battleReport and judgement instances
 * @throws Error if used outside RepositoryProvider
 *
 * @see {@link useRepositoriesOptional} for optional variant
 * @see {@link RepoContextValue} for return type structure
 */
export function useRepositories(): RepoContextValue {
  const ctx = useContext(RepoContext);
  if (!ctx)
    throw new Error('useRepositories must be used within RepositoryProvider');
  return ctx;
}

/**
 * Hook to optionally access repository instances from React context.
 *
 * **Optional Context Hook**:
 * - Returns null if used outside RepositoryProvider
 * - Allows conditional repository usage
 * - Useful for components with optional repository integration
 * - Enables graceful degradation when repositories unavailable
 *
 * **Use Cases**:
 * - Components that work with or without repositories
 * - Conditional repository features
 * - Testing scenarios with partial context
 * - Fallback repository implementations
 *
 * **Usage Pattern**:
 * ```typescript
 * function OptionalBattleComponent() {
 *   const repositories = useRepositoriesOptional();
 *
 *   if (repositories) {
 *     // Use injected repositories
 *     const battle = await repositories.battleReport.generateReport();
 *   } else {
 *     // Fallback behavior
 *     const battle = await fallbackRepository.generateReport();
 *   }
 * }
 * ```
 *
 * @returns Repository context value or null if outside provider
 *
 * @see {@link useRepositories} for required variant
 * @see {@link RepoContextValue} for return type structure
 */
export function useRepositoriesOptional(): RepoContextValue | null {
  return useContext(RepoContext);
}
