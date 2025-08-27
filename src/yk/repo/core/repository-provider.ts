import type {
  BattleReportRepository,
  JudgementRepository,
} from './repositories';
import type { PlayMode } from '@/yk/play-mode';

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
 * - `'api'` → {@link ApiBattleReportRepository} with REST API client
 * - `'historical-evidences'` → {@link HistoricalEvidencesBattleReportRepository}
 * - `'historical-evidence'` → {@link BattleReportRandomDataRepository} with seed-system
 * - `'mixed-nuts'` → {@link BattleReportRandomDataRepository} with seed-system
 * - **Default** → {@link BattleReportRandomDataRepository} with seed-system
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
 * // API mode with REST endpoint
 * const apiRepo = await getBattleReportRepository({ id: 'api' });
 *
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
export async function getBattleReportRepository(
  mode?: PlayMode,
  seedFile?: string,
): Promise<BattleReportRepository> {
  // Tip: add new branches per mode here (e.g., 'demo', 'api')
  // if (mode?.id === 'demo-custom') {
  //   const { DemoBattleReportRepository } = await import('@/yk/repo/demo/repositories.demo');
  //   return new DemoBattleReportRepository();
  // }
  if (mode?.id === 'api') {
    const { ApiClient, ApiBattleReportRepository } = await import(
      '@/yk/repo/api/repositories.api'
    );
    const base: string = getApiBaseUrl();
    const api = new ApiClient(base);
    const delay = defaultDelayForMode(mode, 'report');
    return new ApiBattleReportRepository(api, { delay });
  }
  if (mode?.id === 'historical-evidences') {
    const { HistoricalEvidencesBattleReportRepository } = await import(
      '@/yk/repo/historical-evidences/repositories.historical-evidences'
    );
    const delay = defaultDelayForMode(mode, 'report');
    return new HistoricalEvidencesBattleReportRepository({
      file: seedFile,
      delay,
    });
  }
  if (mode?.id === 'historical-evidence') {
    const { BattleReportRandomDataRepository } = await import(
      '@/yk/repo/random-jokes/repositories.random-jokes'
    );
    // Selected seed is provided via context; callers pass it here.
    const delay = defaultDelayForMode(mode, 'report');
    return new BattleReportRandomDataRepository({ seedFile, delay });
  }
  if (mode?.id === 'mixed-nuts') {
    const { BattleReportRandomDataRepository } = await import(
      '@/yk/repo/random-jokes/repositories.random-jokes'
    );
    const delay = defaultDelayForMode(mode, 'report');
    return new BattleReportRandomDataRepository({ seedFile, delay });
  }

  // Default: Use seed-based repository with random selection
  const { BattleReportRandomDataRepository } = await import(
    '@/yk/repo/random-jokes/repositories.random-jokes'
  );
  const delay = defaultDelayForMode(mode, 'report');
  return new BattleReportRandomDataRepository({ seedFile, delay });
}

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
 * - `'api'` → {@link ApiJudgementRepository} with remote AI/ML judging
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
 * // API-based judging with ML models
 * const apiJudge = await getJudgementRepository({ id: 'api' });
 *
 * // Default algorithmic judging
 * const localJudge = await getJudgementRepository();
 *
 * // Usage in battle resolution
 * const winner = await judge.determineWinner({
 *   mode,
 *   yono: battle.yono,
 *   komae: battle.komae
 * });
 * ```
 */
export async function getJudgementRepository(
  mode?: PlayMode,
): Promise<JudgementRepository> {
  const { FakeJudgementRepository } = await import(
    '@/yk/repo/mock/repositories.fake'
  );
  const delay = defaultDelayForMode(mode, 'judgement');
  // Tip: add new branches per mode here (e.g., 'demo', 'api')
  // if (mode?.id === 'demo-custom') {
  //   const { DemoJudgementRepository } = await import('@/yk/repo/demo/repositories.demo');
  //   return new DemoJudgementRepository();
  // }
  if (mode?.id === 'api') {
    const { ApiClient, ApiJudgementRepository } = await import(
      '@/yk/repo/api/repositories.api'
    );
    const base: string = getApiBaseUrl();
    const api = new ApiClient(base);
    const judgementDelay = defaultDelayForMode(mode, 'judgement');
    // Order matters: timing wraps underlying call; collapsing ensures
    // only one underlying call happens and all subscribers share it.
    return withJudgementCollapsing(
      withJudgementTiming(
        new ApiJudgementRepository(api, { delay: judgementDelay }),
      ),
    );
  }
  return withJudgementCollapsing(
    withJudgementTiming(new FakeJudgementRepository({ delay })),
  );
}

/**
 * Utility function to safely access Vite environment variables.
 *
 * **Purpose**: Encapsulates type assertion for import.meta.env access
 * **Type Safety**: Provides proper TypeScript typing for Vite env variables
 * **Maintainability**: Centralizes env variable access patterns
 *
 * @param key Environment variable key (e.g., 'VITE_API_BASE_URL')
 * @returns Environment variable value or undefined if not set
 *
 * @internal
 */
function getViteEnvVar(key: string): string | undefined {
  // Vite injects env variables into import.meta.env
  // Type assertion is encapsulated here for maintainability
  const env = (
    import.meta as unknown as { env?: Record<string, string | undefined> }
  ).env;
  return env?.[key];
}

/**
 * Get the configured API base URL for REST API communication.
 *
 * **Configuration**:
 * - Primary: `VITE_API_BASE_URL` environment variable
 * - Fallback: `/api` for local development
 *
 * @returns Configured API base URL
 *
 * @internal
 */
function getApiBaseUrl(): string {
  return getViteEnvVar('VITE_API_BASE_URL') ?? '/api';
}

/**
 * Delay configuration type for repository operations.
 * - `'report'`: Battle report generation delays
 * - `'judgement'`: Battle judgement processing delays
 */
type DelayKind = 'report' | 'judgement';

/**
 * Calculate artificial delay configuration based on PlayMode and operation type.
 *
 * **Purpose**:
 * - Simulates realistic processing times for better UX
 * - Provides different delays per PlayMode for appropriate feel
 * - Supports both battle report generation and judgement delays
 *
 * **Delay Strategy**:
 * - **Demo mode**: Moderate delays for presentation feel (0.8-1.6s)
 * - **API mode**: Longer delays to simulate network calls (1.5-3.0s)
 * - **Historical modes**: Processing delays for data-heavy operations (1.0-2.5s)
 * - **Default**: Moderate delays for unknown modes (0.8-1.5s)
 *
 * @param mode Optional PlayMode determining delay characteristics
 * @param kind Type of operation being delayed
 * @returns Delay configuration object with min/max ms, or 0 for no delay
 *
 * @internal
 */
function defaultDelayForMode(mode?: PlayMode, kind: DelayKind = 'report') {
  // Uniformly apply 0-5000ms delay for all judgement operations
  if (kind === 'judgement') {
    return { min: 0, max: 5000 };
  }
  if (!mode)
    return kind === 'report' ? { min: 800, max: 1500 } : { min: 150, max: 400 };

  switch (mode.id) {
    case 'demo':
      return kind === 'report'
        ? { min: 800, max: 1600 }
        : { min: 0, max: 5000 };
    case 'api':
      return kind === 'report'
        ? { min: 1500, max: 3000 } // API calls feel more realistic with longer delays
        : { min: 0, max: 5000 };
    case 'historical-evidences':
      return kind === 'report'
        ? { min: 1200, max: 2500 }
        : { min: 0, max: 5000 };
    case 'historical-evidence': // Single form
      return kind === 'report'
        ? { min: 1000, max: 2000 }
        : { min: 0, max: 5000 };
    case 'mixed-nuts':
      return kind === 'report'
        ? { min: 1200, max: 2500 }
        : { min: 0, max: 5000 };
    default:
      // Apply moderate delay for unknown modes
      return kind === 'report'
        ? { min: 800, max: 1500 }
        : { min: 0, max: 5000 };
  }
}

// ---- instrumentation helpers ----
function isTestEnv(): boolean {
  type Env = { NODE_ENV?: string };
  const env: Env | undefined =
    typeof process !== 'undefined'
      ? (process as unknown as { env?: Env }).env
      : undefined;
  return env?.NODE_ENV === 'test';
}

function withJudgementTiming<T extends JudgementRepository>(repo: T): T {
  // structural typing allows us to return a decorated object as T
  const shouldLog = !isTestEnv();
  // Track how many times the same reqId was observed
  const seen: Map<string, number> = new Map();
  const decorated: JudgementRepository = {
    async determineWinner(input, options) {
      const start =
        typeof performance !== 'undefined' ? performance.now() : Date.now();
      // Stable reqId derived from deterministic request key to detect duplicates
      const reqKey = computeJudgementKey(input);
      const reqId = shortHash(reqKey);
      if (shouldLog) {
        const count = (seen.get(reqId) ?? 0) + 1;
        seen.set(reqId, count);
        if (count > 1) {
          console.warn(`[Judgement#${reqId}] duplicate invocation x${count}`);
        }
      }
      if (shouldLog) {
        // called immediately after
        // keep log concise to avoid noisy console
        // console.log( `[Judgement#${reqId}] start repo=${repoName ?? 'unknown'} mode=${input.mode.id} yono=${input.yono.power} komae=${input.komae.power}`,);
      }
      try {
        const result = await repo.determineWinner(input, options);
        if (shouldLog) {
          const end =
            typeof performance !== 'undefined' ? performance.now() : Date.now();
          console.log(
            `[Judgement#${reqId}] done in ${Math.round(end - start)}ms result=${result}`,
          );
        }
        return result;
      } catch (e) {
        if (shouldLog) {
          const end =
            typeof performance !== 'undefined' ? performance.now() : Date.now();
          console.log(
            `[Judgement#${reqId}] error after ${Math.round(end - start)}ms: ${
              e instanceof Error ? e.message : String(e)
            }`,
          );
        }
        throw e;
      }
    },
  };
  return decorated as T;
}

// ---- request collapsing + short-term memoization for judgements ----
type Winner = import('./repositories').Winner;
// reserved for future use

type CacheEntry = {
  promise: Promise<Winner> | null;
  value?: Winner;
  expiresAt: number;
};

// Module-scoped cache to dedupe across multiple repo instances
const judgementCache: Map<string, CacheEntry> = new Map();

function computeJudgementKey(
  input: Parameters<JudgementRepository['determineWinner']>[0],
): string {
  const b = input.battle;
  return JSON.stringify({
    mode: input.mode.id,
    battleId: b.id,
    yono: { title: b.yono.title, power: b.yono.power },
    komae: { title: b.komae.title, power: b.komae.power },
  });
}

function shortHash(input: string): string {
  // Fowler–Noll–Vo (FNV-1a) 32-bit simplified, then base36 shorten
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(36);
}

function withJudgementCollapsing<T extends JudgementRepository>(
  repo: T,
  opts?: { cacheTtlMs?: number; keyFn?: typeof computeJudgementKey },
): T {
  const ttl = opts?.cacheTtlMs ?? (isTestEnv() ? 0 : 60_000); // 60s in dev/prod by default
  const keyFn = opts?.keyFn ?? computeJudgementKey;

  const decorated: JudgementRepository = {
    async determineWinner(input, options) {
      const key = keyFn(input);
      const now = Date.now();
      const current = judgementCache.get(key);

      // Fresh cached value
      if (current && current.value !== undefined && current.expiresAt > now) {
        return current.value;
      }

      // In-flight promise
      if (current && current.promise) {
        // Respect caller abort without cancelling underlying request:
        if (options?.signal) {
          if (options.signal.aborted) {
            throw new DOMException('Aborted', 'AbortError');
          }
          return new Promise<Winner>((resolve, reject) => {
            const onAbort = () =>
              reject(new DOMException('Aborted', 'AbortError'));
            options.signal!.addEventListener('abort', onAbort, { once: true });
            current
              .promise!.then((v) => resolve(v))
              .catch((e) => reject(e))
              .finally(() => {
                options.signal!.removeEventListener('abort', onAbort);
              });
          });
        }
        return current.promise;
      }

      // Start a new underlying call. Important: do NOT pass caller signal
      // so that one impatient subscriber doesn't cancel others.
      const p = repo
        .determineWinner(input)
        .then((value) => {
          // store result with TTL
          judgementCache.set(key, {
            promise: null,
            value,
            expiresAt: Date.now() + ttl,
          });
          return value as Winner;
        })
        .catch((err) => {
          // clear entry on error so future attempts can retry
          judgementCache.delete(key);
          throw err;
        });

      judgementCache.set(key, {
        promise: p,
        value: undefined,
        expiresAt: now + ttl,
      });

      // Return subscriber-aware promise that respects their abort if provided
      if (options?.signal) {
        if (options.signal.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }
        return new Promise<Winner>((resolve, reject) => {
          const onAbort = () =>
            reject(new DOMException('Aborted', 'AbortError'));
          options.signal!.addEventListener('abort', onAbort, { once: true });
          p.then((v) => resolve(v))
            .catch((e) => reject(e))
            .finally(() => {
              options.signal!.removeEventListener('abort', onAbort);
            });
        });
      }
      return p;
    },
  };

  return decorated as T;
}
