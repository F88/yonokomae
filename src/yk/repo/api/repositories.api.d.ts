import type {
  BattleReportRepository,
  JudgementRepository,
  Verdict,
} from '@/yk/repo/core/repositories';
import type { Battle, Neta } from '@/types/types';
import { type DelayOption } from '../core/delay-utils';
/** Lightweight fetch wrapper. Adapt as needed. */
export declare class ApiClient {
  private readonly baseUrl;
  private readonly token?;
  constructor(baseUrl: string, token?: string);
  get<T>(
    path: string,
    signal?: AbortSignal,
    headers?: Record<string, string>,
  ): Promise<T>;
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
export declare class ApiBattleReportRepository
  implements BattleReportRepository
{
  private readonly api;
  private readonly delay?;
  constructor(
    api: ApiClient,
    options?: {
      delay?: DelayOption;
    },
  );
  generateReport(opts?: { signal?: AbortSignal }): Promise<Battle>;
}
export declare class ApiJudgementRepository implements JudgementRepository {
  private readonly api;
  private readonly delay?;
  constructor(
    api: ApiClient,
    options?: {
      delay?: DelayOption;
    },
  );
  determineWinner(
    input: {
      battle: {
        id: string;
        yono: Neta;
        komae: Neta;
      };
      mode: {
        id: string;
      };
      extra?: Record<string, unknown>;
    },
    opts?: {
      signal?: AbortSignal;
    },
  ): Promise<Verdict>;
}
