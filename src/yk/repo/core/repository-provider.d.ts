import type {
  BattleReportRepository,
  JudgementRepository,
} from './repositories';
import type { PlayMode } from '../../play-mode';
/**
 * Factory function for creating BattleReportRepository instances based on PlayMode.
 *
 * **Core Factory Pattern Implementation**:
 * - Encapsulates repository instantiation logic
 * - Provides dynamic import loading for code splitting
 * - Maps PlayMode configurations to concrete implementations
 * - Handles dependency injection and configuration
 *
 * **PlayMode Mapping**:
 * - `'historical-research'` → {@link HistoricalEvidencesBattleReportRepository}
 * - **Default** → {@link HistoricalEvidencesBattleReportRepository}
 *
 * **Dynamic Import Benefits**:
 * - Code splitting: Only loads required implementation modules
 * - Lazy loading: Reduces initial bundle size
 * - Tree shaking: Eliminates unused repository code
 *
 * **Configuration**:
 * - Environment variables: API base URLs, feature flags
 * - Seed file selection: For seed-based implementations
 * - Delay simulation: For development/demo modes
 *
 * @param mode Optional PlayMode determining repository type
 * @param seedFile Optional seed file for seed-based repositories
 * @returns Promise resolving to configured BattleReportRepository instance
 *
 * @example
 * ```typescript
 * // Seed-based with specific file
 * const seedRepo = await getBattleReportRepository(
 *   { id: 'historical-evidence' },
 *   'battle-scenario.json'
 * );
 *
 * // Default seed-based for development
 * const defaultRepo = await getBattleReportRepository();
 * ```
 */
export declare function getBattleReportRepository(
  mode?: PlayMode,
  seedFile?: string,
): Promise<BattleReportRepository>;
/**
 * Factory function for creating JudgementRepository instances based on PlayMode.
 *
 * **Judgement Factory Implementation**:
 * - Creates repository instances for battle outcome determination
 * - Maps PlayMode to appropriate judging strategies
 * - Handles configuration and dependency injection
 * - Supports both local and remote judging systems
 *
 * **PlayMode Mapping**:
 * - **Default** → {@link FakeJudgementRepository} with algorithmic judging
 *
 * **Judging Strategies**:
 * - **Algorithmic**: Local rule-based power comparison
 * - **Remote API**: Server-side ML models or complex engines
 * - **Configurable Delay**: Simulates processing time for UX
 *
 * **Future Extensions**:
 * - Mode-specific judging rules (different algorithms per mode)
 * - ML model integration for sophisticated battle outcomes
 * - Historical data analysis for context-aware judging
 *
 * @param mode Optional PlayMode determining judging strategy
 * @returns Promise resolving to configured JudgementRepository instance
 *
 * @example
 * ```typescript
 * // Default algorithmic judging
 * const localJudge = await getJudgementRepository();
 *
 * // Usage in battle resolution
 * const verdict = await judge.determineWinner({
 *   mode,
 *   yono: battle.yono,
 *   komae: battle.komae
 * });
 * ```
 */
export declare function getJudgementRepository(
  mode?: PlayMode,
): Promise<JudgementRepository>;
export declare function clearAllJudgementCache(): void;
export declare function bustJudgementCacheFor(
  input: Parameters<JudgementRepository['determineWinner']>[0],
  opts?: {
    maxSize?: number;
  },
): void;
