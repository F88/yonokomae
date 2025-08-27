import type {
  BattleReportRepository,
  JudgementRepository,
  Winner,
} from '@/yk/repo/core/repositories';
import type { Battle, Neta } from '@/types/types';
import { applyDelay, type DelayOption } from '../core/delay-utils';

/** Custom HTTP error with status code for robust error handling */
class HttpError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/** Lightweight fetch wrapper. Adapt as needed. */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly token?: string;
  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async get<T>(
    path: string,
    signal?: AbortSignal,
    headers?: Record<string, string>,
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : undefined),
        ...headers,
      },
      signal,
    });
    if (!res.ok) throw new HttpError(`HTTP ${res.status}`, res.status);
    return res.json() as Promise<T>;
  }
}

/**
 * ApiBattleReportRepository
 *
 * **Purpose**: REST API client implementation for production battle report generation.
 *
 * **Data Source**:
 * - Fetches battle reports from remote REST API endpoint
 * - Makes HTTP GET requests to `/battle/report`
 * - Expects server to return complete Battle objects
 *
 * **Features**:
 * - HTTP-based communication with backend services
 * - Built-in request cancellation via AbortSignal
 * - Uses custom ApiClient for network layer abstraction
 * - Handles JSON serialization/deserialization automatically
 * - Base URL configuration via environment variables
 *
 * **Use Cases**:
 * - Production environment with live backend
 * - API mode PlayMode selection
 * - Integration with external battle generation services
 *
 * **Configuration**:
 * - Base API URL: Set via `VITE_API_BASE_URL` environment variable
 * - Default fallback: `/api`
 *
 * **Dependencies**: Custom ApiClient, fetch API
 *
 * @see {@link BattleReportRepository} for interface definition
 * @see {@link ApiClient} for HTTP client implementation
 */
export class ApiBattleReportRepository implements BattleReportRepository {
  private readonly api: ApiClient;
  private readonly delay?: DelayOption;

  constructor(api: ApiClient, options?: { delay?: DelayOption }) {
    this.api = api;
    this.delay = options?.delay;
  }

  async generateReport(opts?: { signal?: AbortSignal }): Promise<Battle> {
    await applyDelay(this.delay, opts?.signal);
    return this.api.get<Battle>('/battle/report', opts?.signal);
  }
}

export class ApiJudgementRepository implements JudgementRepository {
  private readonly api: ApiClient;
  private readonly delay?: DelayOption;

  constructor(api: ApiClient, options?: { delay?: DelayOption }) {
    this.api = api;
    this.delay = options?.delay;
  }
  async determineWinner(
    input: {
      battle: { id: string; yono: Neta; komae: Neta };
      mode: { id: string };
      extra?: Record<string, unknown>;
    },
    opts?: { signal?: AbortSignal },
  ): Promise<Winner> {
    await applyDelay(this.delay, opts?.signal);
    const mode = input.mode.id;
    const reqKey = JSON.stringify({ battleId: input.battle.id, mode });
    const idempotencyKey = fnv1a32(reqKey);
    const path = `/battle/judgement?mode=${encodeURIComponent(mode)}`;
    return getWithRetry<Winner>(this.api, path, opts?.signal, {
      'X-Idempotency-Key': idempotencyKey,
    });
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    if (signal) {
      const onAbort = () => {
        clearTimeout(t);
        reject(new DOMException('Aborted', 'AbortError'));
      };
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}

async function getWithRetry<T>(
  api: ApiClient,
  path: string,
  signal?: AbortSignal,
  headers?: Record<string, string>,
): Promise<T> {
  let attempt = 0;
  const maxAttempts = 2; // 1 retry on 5xx
  while (true) {
    try {
      return await api.get<T>(path, signal, headers);
    } catch (e) {
      attempt++;
      const is5xx = e instanceof HttpError && e.status >= 500 && e.status <= 599;
      if (!is5xx || attempt >= maxAttempts) throw e;
      // exponential backoff with jitter: base 200ms
      const base = 200 * Math.pow(2, attempt - 1);
      const jitter = Math.floor(Math.random() * 100);
      await sleep(base + jitter, signal);
    }
  }
}

/**
 * FNV-1a 32-bit hash
 *
 * Purpose: generate a fast, non-cryptographic hash for idempotency keys and
 * lightweight deduplication. Do NOT use for security-sensitive purposes.
 *
 * Algorithm:
 * - Initialize with 32-bit FNV offset basis 0x811c9dc5
 * - For each UTF-16 code unit: XOR then multiply by 32-bit FNV prime 16777619
 *   (implemented via shift/add to keep it as unsigned 32-bit arithmetic)
 * - Return the unsigned hash encoded in base36 for compactness
 *
 * References:
 * - https://en.wikipedia.org/wiki/Fowler–Noll–Vo_hash_function
 */
function fnv1a32(input: string): string {
  // 0x811c9dc5: 32-bit FNV offset basis
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    // XOR with next byte (here, UTF-16 code unit)
    h ^= input.charCodeAt(i);
    // Multiply by FNV prime 16777619 using shifts to stay in uint32 domain
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  // base36 for shorter, URL/header-friendly representation
  return h.toString(36);
}
