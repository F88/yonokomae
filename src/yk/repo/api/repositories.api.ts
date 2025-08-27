import type {
  BattleReportRepository,
  JudgementRepository,
  Winner,
} from '@/yk/repo/core/repositories';
import type { Battle, Neta } from '@/types/types';
import { applyDelay, type DelayOption } from '../core/delay-utils';

/** Lightweight fetch wrapper. Adapt as needed. */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly token?: string;
  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: this.token
        ? { Authorization: `Bearer ${this.token}` }
        : undefined,
      signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
      mode: { id: string };
      yono: Neta;
      komae: Neta;
    },
    opts?: { signal?: AbortSignal },
  ): Promise<Winner> {
    await applyDelay(this.delay, opts?.signal);
    // This is a placeholder; adapt path and payload to your API
    return this.api.get<Winner>(
      `/battle/judgement?mode=${encodeURIComponent(input.mode.id)}`,
      opts?.signal,
    );
  }
}
