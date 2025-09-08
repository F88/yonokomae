// ---- judgement cache hit/miss counters (development/debug only) ----
// These counters are used for logging cache hit/miss rates during development.
// They are module-scoped and accumulate values for the lifetime of the process.
// Not suitable for production or multi-process environments.
// Reset only on reload. For accurate analytics, use a proper metrics system.
let cacheHitCount = 0;
let cacheMissCount = 0;

// --- logging feature flag configuration (env-driven) ---
// Supported boolean environment variable values (case-insensitive):
// '1', 'true', 'yes', 'on' => true | '0', 'false', 'no', 'off' => false
// Any other / undefined => defaultValue.
function readBooleanEnv(key: string, defaultValue: boolean): boolean {
  try {
    const env = (
      import.meta as unknown as { env?: Record<string, string | undefined> }
    ).env;
    const raw = env?.[key];
    if (!raw) return defaultValue;
    const v = raw.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(v)) return true;
    if (['0', 'false', 'no', 'off'].includes(v)) return false;
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

// Detect test mode safely (works in browser + node). Prefer import.meta.env.MODE.
const __isTestMode = (() => {
  try {
    if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'test')
      return true;
  } catch {
    // ignore: process may be undefined in browser
  }
  try {
    const env = (
      import.meta as unknown as { env?: Record<string, string | undefined> }
    ).env;
    if (env?.MODE === 'test' || env?.NODE_ENV === 'test') return true;
  } catch {
    // ignore: import.meta.env access may throw in some tooling contexts
  }
  return false;
})();

// Feature flag: judgement cache hit/miss logging
const JUDGEMENT_CACHE_LOG_ENABLED = __isTestMode
  ? false
  : readBooleanEnv('VITE_LOG_JUDGEMENT_CACHE', false);
// Feature flag: judgement timing (groupCollapsed + duplicate warnings)
const JUDGEMENT_TIMING_LOG_ENABLED = __isTestMode
  ? false
  : readBooleanEnv('VITE_LOG_JUDGEMENT_TIMING', false);

import type {
  BattleReportRepository,
  JudgementRepository,
} from './repositories';
import type { PlayMode } from '@/yk/play-mode';

/**
 * Factory function for creating BattleReportRepository instances based on PlayMode.
 *
 * Core responsibilities:
 * - Encapsulate repository instantiation logic
 * - Use dynamic imports for code splitting and lazy loading
 * - Map PlayMode to concrete implementations
 * - Wire configuration and dependency injection
 *
 * PlayMode mapping (runtime reachability):
 * - `demo | demo-en | demo-de` → language-specific Demo repositories
 * - `historical-research` → {@link HistoricalEvidencesBattleReportRepository}
 * - `yk-now` → {@link NewsReporterMultiSourceReportRepository} (merges local file + API)
 * - `historical-evidence` → {@link HistoricalEvidencesBattleReportRepository}
 *   - Internal/unexposed in current play modes; kept for seed-system callers
 * - Default/others → {@link HistoricalEvidencesBattleReportRepository}
 *
 * Dynamic import benefits:
 * - Code splitting: load only the required implementation modules
 * - Lazy loading: reduce initial bundle size
 * - Tree shaking: eliminate unused repository code
 *
 * Configuration:
 * - `VITE_API_BASE_URL`: REST base URL for API-backed repos (news reporter)
 * - `VITE_NEWS_REPORT_CACHE_TTL_MS`: cache TTL for news API results (ms)
 * - `VITE_BATTLE_RANDOM_WEIGHT_API`: blending weight (0..1) for news API vs local
 * - Seed file selection: for seed-based implementations
 * - Delay simulation: per-mode ranges for a realistic UX
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
export async function getBattleReportRepository(
  mode?: PlayMode,
  seedFile?: string,
): Promise<BattleReportRepository> {
  // Tip: add new branches per mode here (e.g., 'demo', 'api')
  if (mode?.id === 'demo') {
    const { DemoJaBattleReportRepository } = await import(
      '@/yk/repo/demo/demo-ja/repositories.demo-ja'
    );
    const delay = defaultDelayForMode(mode, 'report');
    return new DemoJaBattleReportRepository({ delay });
  }
  if (mode?.id === 'demo-en') {
    const { DemoEnBattleReportRepository } = await import(
      '@/yk/repo/demo/demo-en/repositories.demo-en'
    );
    const delay = defaultDelayForMode(mode, 'report');
    return new DemoEnBattleReportRepository({ delay });
  }
  if (mode?.id === 'demo-de') {
    const { DemoDeBattleReportRepository } = await import(
      '@/yk/repo/demo/demo-de/repositories.demo-de'
    );
    const delay = defaultDelayForMode(mode, 'report');
    return new DemoDeBattleReportRepository({ delay });
  }
  // Note: legacy 'api' battle-report mode has been removed; it falls back to default.

  // Play mode 'yk-now'
  if (mode?.id === 'yk-now') {
    const { NewsReporterMultiSourceReportRepository } = await import(
      '@/yk/repo/news/repositories.news-reporter'
    );
    const { NewsReporterApiBattleReportRepository } = await import(
      '@/yk/repo/news/repositories.news-reporter.api'
    );
    const { NewsReporterFileiBattleReportRepository } = await import(
      '@/yk/repo/news/repositories.news-reporter.file'
    );
    const { ApiClient } = await import('@/lib/api-client');
    const base: string = getApiBaseUrl();
    const api = new ApiClient(base);
    const delay = defaultDelayForMode(mode, 'report');
    const local = new NewsReporterFileiBattleReportRepository({ delay });
    const ttlStr = getViteEnvVar('VITE_NEWS_REPORT_CACHE_TTL_MS');
    const ttlParsed = ttlStr ? Number(ttlStr) : NaN;
    const cacheTtlMs = Number.isFinite(ttlParsed)
      ? Math.max(0, ttlParsed)
      : 30_000;
    const remote = new NewsReporterApiBattleReportRepository(api, {
      delay,
      cacheTtlMs,
    });
    const w = Number(getViteEnvVar('VITE_BATTLE_RANDOM_WEIGHT_API') ?? '0.5');
    const weightApi = Number.isFinite(w) ? w : 0.5;
    return new NewsReporterMultiSourceReportRepository({
      local,
      api: remote,
      weightApi,
      delay,
    });
  }

  // Play mode 'historical-research'
  if (mode?.id === 'historical-research') {
    const { HistoricalEvidencesBattleReportRepository } = await import(
      '@/yk/repo/historical-evidences/repositories.historical-evidences'
    );
    const delay = defaultDelayForMode(mode, 'report');
    return new HistoricalEvidencesBattleReportRepository({
      file: seedFile,
      delay,
    });
  }

  // Default: Use seed-based repository with random selection
  const { HistoricalEvidencesBattleReportRepository } = await import(
    '@/yk/repo/historical-evidences/repositories.historical-evidences'
  );
  const delay = defaultDelayForMode(mode, 'report');
  return new HistoricalEvidencesBattleReportRepository({
    file: seedFile,
    delay,
  });
}

/**
 * Factory function for creating JudgementRepository instances based on PlayMode.
 *
 * Judgement factory responsibilities:
 * - Instantiate outcome determination repositories
 * - Map PlayMode to judging strategies
 * - Apply timing and request-collapsing decorators
 * - Support both local and remote judging systems
 *
 * PlayMode mapping:
 * - `demo | demo-en | demo-de` → corresponding Demo*JudgementRepository
 * - `historical-research` → {@link HistoricalEvidencesJudgementRepository}
 * - Legacy `api` (removed) → fell back to {@link FakeJudgementRepository}
 * - Default/others (e.g., `yk-now`) → {@link FakeJudgementRepository}
 *
 * Judging strategies:
 * - Algorithmic: local rule-based power comparison (Fake)
 * - Remote API: server-side/ML judging (legacy)
 * - Decorators: configurable timing + request collapsing with TTL
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
  /**
   * Note: FakeJudgementRepository is the baseline implementation. It is
   * decorated with timing and request-collapsing below unless a mode-specific
   * repository is selected first.
   */
  const { FakeJudgementRepository } = await import(
    '@/yk/repo/mock/repositories.fake'
  );
  const delay = defaultDelayForMode(mode, 'judgement');
  // Tip: add new branches per mode here (e.g., 'demo', 'api')
  if (mode?.id === 'demo') {
    const { DemoJaJudgementRepository } = await import(
      '@/yk/repo/demo/demo-ja/repositories.demo-ja'
    );
    const judgementDelay = defaultDelayForMode(mode, 'judgement');
    return withJudgementCollapsing(
      withJudgementTiming(
        new DemoJaJudgementRepository({ delay: judgementDelay }),
      ),
    );
  }
  if (mode?.id === 'demo-en') {
    const { DemoEnJudgementRepository } = await import(
      '@/yk/repo/demo/demo-en/repositories.demo-en'
    );
    const judgementDelay = defaultDelayForMode(mode, 'judgement');
    return withJudgementCollapsing(
      withJudgementTiming(
        new DemoEnJudgementRepository({ delay: judgementDelay }),
      ),
    );
  }
  if (mode?.id === 'demo-de') {
    const { DemoDeJudgementRepository } = await import(
      '@/yk/repo/demo/demo-de/repositories.demo-de'
    );
    const judgementDelay = defaultDelayForMode(mode, 'judgement');
    return withJudgementCollapsing(
      withJudgementTiming(
        new DemoDeJudgementRepository({ delay: judgementDelay }),
      ),
    );
  }
  // Legacy 'api' judgement mode removed: no special handling.
  if (mode?.id === 'historical-research') {
    const { HistoricalEvidencesJudgementRepository } = await import(
      '@/yk/repo/historical-evidences/repositories.historical-evidences'
    );
    const { getJudgementCollapseConfigFor } = await import(
      './judgement-config'
    );
    const judgementDelay = defaultDelayForMode(mode, 'judgement');
    const cfg = getJudgementCollapseConfigFor('historical');
    return withJudgementCollapsing(
      withJudgementTiming(
        new HistoricalEvidencesJudgementRepository({ delay: judgementDelay }),
      ),
      {
        enabled: cfg.enabled,
        cacheTtlMs: cfg.ttlMs,
        maxSize: cfg.maxSize,
        // Historical mode uses RNG; key on (battle, judge) only so the
        // first random outcome is reused for that pair within TTL.
        keyFn: computeHistoricalJudgementKey,
      },
    );
  }
  const { getJudgementCollapseConfigFor } = await import('./judgement-config');
  const cfg = getJudgementCollapseConfigFor('fake');
  return withJudgementCollapsing(
    withJudgementTiming(new FakeJudgementRepository({ delay })),
    { enabled: cfg.enabled, cacheTtlMs: cfg.ttlMs, maxSize: cfg.maxSize },
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

// Note: Environment-based overrides for judgement collapsing have been removed to avoid confusion.

/**
 * Delay configuration type for repository operations.
 * - `'report'`: Battle report generation delays
 * - `'judgement'`: Battle judgement processing delays
 */
type DelayKind = 'report' | 'judgement';

/**
 * Calculate artificial delay configuration based on PlayMode and operation type.
 *
 * Purpose:
 * - Simulate realistic processing times for better UX
 * - Provide different delays per PlayMode for appropriate feel
 * - Support both battle report generation and judgement delays
 *
 * Delay strategy (matches implementation):
 * - Judgement (all modes): 1.0–3.0s
 * - Report/demo: 0.8–1.6s
 * - Report/api: 1.5–3.0s (legacy mode baseline)
 * - Report/historical-research: 1.2–2.5s
 * - Report/yk-now: 0–0 (no artificial delay)
 * - Report/default/others: 0–0
 *
 * @param mode Optional PlayMode determining delay characteristics
 * @param kind Type of operation being delayed
 * @returns `{ min: number; max: number }` delay range in milliseconds
 *
 * @internal
 */
function defaultDelayForMode(mode?: PlayMode, kind: DelayKind = 'report') {
  // Uniform delay range for judgement operations
  if (kind === 'judgement') {
    return { min: 1_000, max: 3_000 };
  }
  // From here on, kind is 'report' only.
  if (!mode) return { min: 800, max: 1500 };

  switch (mode.id) {
    case 'historical-research':
      return { min: 500, max: 2_000 };
    // return { min: 0, max: 0 };
    // return { min: 5500, max: 10_000 };
    case 'yk-now':
      return { min: 200, max: 500 };
    case 'demo':
      return { min: 800, max: 1600 };
    case 'api':
      // Legacy mode; keep mapping for compatibility though unused
      return { min: 1500, max: 3000 };
    default:
      // Apply moderate delay for unknown modes
      return { min: 0, max: 0 };
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

/**
 * Decorate a JudgementRepository to log timing and duplicate invocations.
 *
 * - Logs a collapsed console group per request with a short, deterministic id
 * - Warns on duplicate invocations of the same logical request
 * - Measures and logs duration; disabled when `NODE_ENV === 'test'`
 *
 * This decorator is side-effect-only (logging); it does not modify
 * control flow or add artificial delays.
 */
function withJudgementTiming<T extends JudgementRepository>(repo: T): T {
  // structural typing allows us to return a decorated object as T
  const shouldLog = JUDGEMENT_TIMING_LOG_ENABLED && !isTestEnv();
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
        // console.groupCollapsed(
        console.debug(
          `Judgement#${reqId} battle=${'battle' in input ? input.battle.id : '?'}`,
        );
        console.log('start');
      }
      try {
        const result = await repo.determineWinner(input, options);
        if (shouldLog) {
          const end =
            typeof performance !== 'undefined' ? performance.now() : Date.now();
          console.log(`done in ${Math.round(end - start)}ms result=${result}`);
          console.groupEnd();
        }
        return result;
      } catch (e) {
        if (shouldLog) {
          const end =
            typeof performance !== 'undefined' ? performance.now() : Date.now();
          console.error(
            `error after ${Math.round(end - start)}ms: ${
              e instanceof Error ? e.message : String(e)
            }`,
          );
          console.groupEnd();
        }
        throw e;
      }
    },
  };
  return decorated as T;
}

// ---- request collapsing + short-term memoization for judgements ----
type Verdict = import('./repositories').Verdict;
// reserved for future use

type CacheEntry = {
  promise: Promise<Verdict> | null;
  value?: Verdict;
  expiresAt: number;
};

/**
 * Minimal LRU cache used by request-collapsing layer.
 *
 * - Updates recency on get/set
 * - Evicts the least-recently used entry when `maxSize` is exceeded
 * - Not thread-safe; intended for single-process/browser usage
 */
class LruCache<K, V> {
  private map = new Map<K, V>();
  private maxSize: number;
  constructor(maxSize: number) {
    this.maxSize = Math.max(1, maxSize);
  }
  get(key: K): V | undefined {
    const val = this.map.get(key);
    if (val !== undefined) {
      // refresh recency
      this.map.delete(key);
      this.map.set(key, val);
    }
    return val;
  }
  set(key: K, val: V): void {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, val);
    if (this.map.size > this.maxSize) {
      // evict least recently used (first)
      const oldest = this.map.keys().next().value as K | undefined;
      if (oldest !== undefined) this.map.delete(oldest);
    }
  }
  delete(key: K): void {
    this.map.delete(key);
  }
  clear(): void {
    this.map.clear();
  }
  size(): number {
    return this.map.size;
  }
}

// Module-scoped cache to dedupe across multiple repo instances
let judgementCache: LruCache<string, CacheEntry> | null = null;
function getJudgementCache(maxSize: number): LruCache<string, CacheEntry> {
  if (!judgementCache) {
    judgementCache = new LruCache<string, CacheEntry>(maxSize);
  }
  return judgementCache;
}

/**
 * Compute a stable, JSON-based key for a judgement request.
 *
 * The key includes mode id, battle id, and reduced fighter descriptors
 * (title, power). It is designed to be deterministic across equivalent
 * requests so that identical calls can be collapsed and cached.
 */
function computeJudgementKey(
  input: Parameters<JudgementRepository['determineWinner']>[0],
): string {
  const b = input.battle;
  return JSON.stringify({
    judge: input.judge?.id ?? null,
    battleId: b.id,
    yono: { title: b.yono.title, power: b.yono.power },
    komae: { title: b.komae.title, power: b.komae.power },
  });
}

/**
 * Compute a cache key for historical-research judgement.
 *
 * Intentionally ignores fighter titles/power to ensure the RNG-based
 * result is fixed per (battle, judge) pair within the cache TTL.
 */
function computeHistoricalJudgementKey(
  input: Parameters<JudgementRepository['determineWinner']>[0],
): string {
  return JSON.stringify({
    judge: input.judge?.id ?? null,
    battleId: input.battle.id,
  });
}

/**
 * Produce a short, human-friendly hash string for logging/grouping.
 *
 * Uses a simplified 32-bit FNV-1a and base36 encoding.
 */
function shortHash(input: string): string {
  // Fowler–Noll–Vo (FNV-1a) 32-bit simplified, then base36 shorten
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(36);
}

/**
 * Decorate a JudgementRepository to collapse concurrent identical requests
 * and memoize recent results with a TTL.
 *
 * Behavior:
 * - If an equal request is in-flight, all callers await the same promise
 * - On success, the value is cached until `ttl` expires (LRU-bounded)
 * - Caller-provided AbortSignal aborts that caller only (not the shared call)
 * - Errors clear the cache entry so subsequent attempts can retry
 *
 * Diagnostics:
 * - Maintains simple module-scoped hit/miss counters and logs a hit rate
 *
 * @param repo Base repository to decorate
 * @param opts.enabled Enable/disable collapsing (default: true)
 * @param opts.cacheTtlMs Cache TTL in ms (default: 60s, or 0 in tests)
 * @param opts.keyFn Key function (default: {@link computeJudgementKey})
 * @param opts.maxSize LRU maximum size (default: 100)
 */
function withJudgementCollapsing<T extends JudgementRepository>(
  repo: T,
  opts?: {
    cacheTtlMs?: number;
    keyFn?: typeof computeJudgementKey;
    enabled?: boolean;
    maxSize?: number;
  },
): T {
  // Only use code-based (per-repo) config; no .env overrides.
  const enabled = opts?.enabled ?? true;
  const maxSize = opts?.maxSize ?? 100;
  const ttl = opts?.cacheTtlMs ?? (isTestEnv() ? 0 : 60_000);
  const keyFn = opts?.keyFn ?? computeJudgementKey;

  // Log cache hit/miss rate for development/debugging
  function logCacheRate() {
    if (!JUDGEMENT_CACHE_LOG_ENABLED) return;
    // Note: These counters are module-scoped and not reset per session/request.
    // For production, use a proper metrics system.
    const total = cacheHitCount + cacheMissCount;
    if (total > 0) {
      const rate = ((cacheHitCount / total) * 100).toFixed(1);
      console.info(
        `judgement.cache.rate: ${cacheHitCount}/${total} (${rate}%)`,
      );
    }
  }

  const decorated: JudgementRepository = {
    async determineWinner(input, options) {
      if (!enabled) {
        return repo.determineWinner(input, options);
      }
      const key = keyFn(input);
      const now = Date.now();
      const cache = getJudgementCache(maxSize);
      const current = cache.get(key);

      // Fresh cached value
      if (current && current.value !== undefined && current.expiresAt > now) {
        cacheHitCount++;
        if (JUDGEMENT_CACHE_LOG_ENABLED) {
          console.count('judgement.cache.hit');
          logCacheRate();
        }
        return current.value;
      }

      // In-flight promise
      if (current && current.promise) {
        cacheHitCount++;
        if (JUDGEMENT_CACHE_LOG_ENABLED) {
          console.count('judgement.cache.hit');
          logCacheRate();
        }
        // Respect caller abort without cancelling underlying request:
        if (options?.signal) {
          if (options.signal.aborted) {
            throw new DOMException('Aborted', 'AbortError');
          }
          return new Promise<Verdict>((resolve, reject) => {
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

      cacheMissCount++;
      if (JUDGEMENT_CACHE_LOG_ENABLED) {
        console.count('judgement.cache.miss');
        logCacheRate();
      }
      // Start a new underlying call. Important: do NOT pass caller signal
      // so that one impatient subscriber doesn't cancel others.
      const p = repo
        .determineWinner(input)
        .then((value) => {
          // store result with TTL
          cache.set(key, {
            promise: null,
            value,
            expiresAt: Date.now() + ttl,
          });
          return value as Verdict;
        })
        .catch((err) => {
          // clear entry on error so future attempts can retry
          cache.delete(key);
          throw err;
        });

      cache.set(key, {
        promise: p,
        value: undefined,
        expiresAt: now + ttl,
      });

      // Return subscriber-aware promise that respects their abort if provided
      if (options?.signal) {
        if (options.signal.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }
        return new Promise<Verdict>((resolve, reject) => {
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

// ---- cache management API ----
/**
 * Clear all cached judgement results and in-flight entries.
 *
 * Useful in tests or when underlying data changes and stale results
 * must not be served.
 */
export function clearAllJudgementCache(): void {
  if (judgementCache) judgementCache.clear();
}

/**
 * Bust a specific cached judgement entry by recomputing its key
 * from the provided input shape.
 *
 * @param input Parameters passed to determineWinner; used to compute the key
 * @param opts.maxSize LRU size hint when lazily creating the cache (default 100)
 */
export function bustJudgementCacheFor(
  input: Parameters<JudgementRepository['determineWinner']>[0],
  opts?: { maxSize?: number },
): void {
  const key = computeJudgementKey(input);
  const cache = getJudgementCache(opts?.maxSize ?? 100);
  cache.delete(key);
}
