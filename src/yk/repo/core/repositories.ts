import type { Battle, Neta } from '@/types/types';
import type { PlayMode } from '@/yk/play-mode';

// Re-export types for repository implementations
export type { Battle, Neta, PlayMode };

/**
 * Verdict
 *
 * Rich result for a battle judgement. Contains the winner and
 * lightweight metadata useful for UX, logging, and testing.
 */
export type Verdict = {
  winner: 'YONO' | 'KOMAE' | 'DRAW';
  /** high-level reason of decision path */
  reason: 'bias-hit' | 'power' | 'api' | 'default' | 'near-tie';
  /** normalized judge code, if available */
  judgeCode?: string;
  /** random number sampled in [0,1), if applicable */
  rng?: number;
  /** yono.power - komae.power for quick inspection */
  powerDiff?: number;
  /** optional confidence score 0..1 for future models */
  confidence?: number;
};

/**
 * JudgeIdentity
 *
 * Lightweight identity DTO for a Judge. Prefer passing this across
 * repository boundaries over class instances to keep interfaces stable
 * and serialization-friendly.
 */
export type JudgeIdentity = {
  id: string;
  name: string;
  codeName: string;
};

/**
 * BattleReportRepository
 *
 * **Core interface for battle report generation and retrieval.**
 *
 * **Responsibility**:
 * Provide complete Battle entities from various data sources including:
 * - Seed-based historical scenarios
 * - REST/GraphQL API endpoints
 * - Static battle data files
 * - Database queries
 *
 * **Architecture Role**:
 * - Central abstraction in Repository pattern implementation
 * - Enables hot-swapping of data sources via PlayMode configuration
 * - Provides consistent Battle object structure across all implementations
 * - Supports cancellation via AbortSignal for long-running operations
 *
 * **Usage Pattern**:
 * ```typescript
 * const repository = await getBattleReportRepository(mode, seedFile);
 * const battle = await repository.generateReport({ signal: controller.signal });
 * ```
 *
 * **Implementations**:
 * - {@link HistoricalEvidencesBattleReportRepository} - Curated historical seeds (default)
 * - {@link DemoJaBattleReportRepository} - Fixed demo scenarios
 *
 * @see {@link Battle} for complete battle data structure
 * @see {@link PlayMode} for mode-based repository selection
 */
export interface BattleReportRepository {
  /**
   * Generate or fetch a complete battle report.
   *
   * **Returns**: A complete Battle object with stable ID, characters, scenario, and metadata.
   *
   * **Guarantees**:
   * - Always returns a valid Battle with all required fields
   * - Battle ID is stable and unique
   * - Both Yono and Komae characters are fully populated
   * - Includes narrative elements (title, subtitle, overview)
   *
   * @param options Optional configuration
   * @param options.signal AbortSignal for cancelling long-running operations
   * @returns Promise resolving to complete Battle object
   * @throws Error if generation fails or is cancelled
   */
  generateReport(options?: { signal?: AbortSignal }): Promise<Battle>;
}

/**
 * JudgementRepository
 *
 * **Core interface for battle outcome determination.**
 *
 * **Responsibility**:
 * Determine the winner of a Yono vs Komae battle based on:
 * - Character power levels and attributes
 * - PlayMode-specific rules and logic
 * - Battle context and scenario factors
 *
 * **Implementation Strategies**:
 * - **Pure/Local**: Algorithm-based rules using character stats
 * - **Remote/API**: Server-side ML models or complex rule engines (legacy)
 * - **Random**: Probabilistic outcomes with weighted chances
 * - **Fixed**: Predetermined outcomes for testing/demo
 *
 * **Architecture Role**:
 * - Separates battle outcome logic from battle generation
 * - Enables different judging strategies per PlayMode
 * - Supports both synchronous and asynchronous judging
 * - Provides consistent Verdict type across implementations
 *
 * **Usage Pattern**:
 * ```typescript
 * const repository = await getJudgementRepository(mode);
 * const verdict = await repository.determineWinner({
 *   battle,
 *   judge: { id: 'j-1', name: 'Judge Judy', codeName: 'JUDY' },
 * });
 * ```
 *
 * **Implementations**:
 * - {@link FakeJudgementRepository} - Random/algorithmic judging
 * - Remote API-based judging (legacy)
 * - {@link DemoJaJudgementRepository} - Fixed demo outcomes
 *
 * @see {@link Verdict} for result detail and possible outcomes
 * @see {@link PlayMode} for mode-specific judging rules
 */
export interface JudgementRepository {
  /**
   * Determine the winner of a battle between Yono and Komae.
   *
   * **Decision Factors**:
   * - Character power levels (primary factor)
   * - PlayMode-specific rules and modifiers
   * - Battle context and scenario elements
   * - Random factors (implementation-dependent)
   *
   * @param input Battle and judge identity
   * @param input.battle Complete Battle object for evaluation
   * @param input.judge Identity of the judge performing the evaluation
   * @param options Optional configuration
   * @param options.signal AbortSignal for cancelling long-running judgements
   * @returns Promise resolving to battle Verdict
   * @throws Error if judgement fails or is cancelled
   */
  determineWinner(
    input: {
      battle: Battle;
      judge: JudgeIdentity;
    },
    options?: { signal?: AbortSignal },
  ): Promise<Verdict>;
}

/**
 * ScenarioRepository
 *
 * Interface for generating battle narrative and contextual elements.
 *
 * Status:
 * - No concrete implementation is currently wired in this codebase.
 * - Kept as a stable contract for future extensions (e.g., templates, faker, LLM).
 *
 * Responsibility:
 * - Provide narrative content to enrich battles:
 *   - Title, Subtitle, Overview, and full Narrative text
 *
 * Notes:
 * - Current BattleReportRepository implementations embed their own
 *   narrative logic (seed-system/templates) without depending on this.
 */
export interface ScenarioRepository {
  /**
   * Generate a battle title.
   * @returns Promise resolving to battle title string
   */
  generateTitle(): Promise<string>;

  /**
   * Generate a battle subtitle or tagline.
   * @returns Promise resolving to subtitle string
   */
  generateSubtitle(): Promise<string>;

  /**
   * Generate a battle overview summary.
   * @returns Promise resolving to overview text
   */
  generateOverview(): Promise<string>;

  /**
   * Generate detailed battle narrative.
   * @returns Promise resolving to full narrative text
   */
  generateNarrative(): Promise<string>;
}

/**
 * NetaRepository
 *
 * **Interface for generating character base profiles and attributes.**
 *
 * **Responsibility**:
 * Provide foundational character data for Yono and Komae:
 * - Character visual representation (images)
 * - Character identity (titles, descriptions)
 * - Character background and personality traits
 *
 * **Design Separation**:
 * - **NetaRepository**: Handles profile data (images, descriptions, etc.)
 * - **BattleReportRepository**: Assigns power levels and battle-specific stats
 * - This separation allows character profiles to remain consistent across battles
 *   while power levels can vary per battle scenario
 *
 * **Profile Components**:
 * - **imageUrl**: Character portrait or avatar
 * - **title**: Character name or designation
 * - **subtitle**: Character role or title
 * - **description**: Character background and personality
 *
 * **Implementation Sources**:
 * - Static character databases
 * - Procedural character generators
 * - Seed-based character profiles
 * - Asset collections with character art
 *
 * @see {@link Neta} for complete character structure
 */
export interface NetaRepository {
  /**
   * Get base profile data for Komae character.
   *
   * Power level is intentionally excluded as it's determined during
   * battle generation to allow for scenario-specific balancing.
   *
   * @returns Promise resolving to Komae's base profile
   */
  getKomaeBase(): Promise<
    Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>
  >;

  /**
   * Get base profile data for Yono character.
   *
   * Power level is intentionally excluded as it's determined during
   * battle generation to allow for scenario-specific balancing.
   *
   * @returns Promise resolving to Yono's base profile
   */
  getYonoBase(): Promise<
    Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>
  >;
}

/**
 * Optional granular repos (future):
 * - IdProviderRepository: supply stable unique ids for Battle/Neta
 * - RandomProvider/Clock: provide randomness and timing for deterministic tests
 * These can be added when responsibilities grow.
 */
