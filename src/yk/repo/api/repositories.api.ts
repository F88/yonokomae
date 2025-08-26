import type {
  BattleReportRepository,
  JudgementRepository,
  Winner,
} from '@/yk/repo/core/repositories';
import type { Battle, Neta } from '@/types/types';

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

export class ApiBattleReportRepository implements BattleReportRepository {
  private readonly api: ApiClient;
  constructor(api: ApiClient) {
    this.api = api;
  }
  async generateReport(opts?: { signal?: AbortSignal }): Promise<Battle> {
    return this.api.get<Battle>('/battle/report', opts?.signal);
  }
}

export class ApiJudgementRepository implements JudgementRepository {
  private readonly api: ApiClient;
  constructor(api: ApiClient) {
    this.api = api;
  }
  async determineWinner(
    input: {
      mode: { id: string };
      yono: Neta;
      komae: Neta;
    },
    opts?: { signal?: AbortSignal },
  ): Promise<Winner> {
    // This is a placeholder; adapt path and payload to your API
    return this.api.get<Winner>(
      `/battle/judgement?mode=${encodeURIComponent(input.mode.id)}`,
      opts?.signal,
    );
  }
}
