import type {
  BattleReportRepository,
  JudgementRepository,
} from './repositories';
import type { PlayMode } from '@/yk/play-mode';

export async function getBattleReportRepository(
  mode?: PlayMode,
  seedFile?: string,
): Promise<BattleReportRepository> {
  const { FakeBattleReportRepository } = await import(
    '@/yk/repo/repositories.fake'
  );
  const delay = defaultDelayForMode(mode);
  // Tip: add new branches per mode here (e.g., 'demo-2', 'api')
  // if (mode?.id === 'demo-2') {
  //   const { Demo2BattleReportRepository } = await import('@/yk/repo/repositories.demo2');
  //   return new Demo2BattleReportRepository();
  // }
  if (mode?.id === 'api') {
    const { ApiClient, ApiBattleReportRepository } = await import(
      '@/yk/repo/repositories.api'
    );
    const base: string = getApiBaseUrl();
    const api = new ApiClient(base);
    return new ApiBattleReportRepository(api);
  }
  if (mode?.id === 'historical-evidence') {
    const { HistoricalBattleReportRepository } = await import(
      '@/yk/repo/repositories.historical'
    );
    // Selected seed is provided via context; callers pass it here.
    return new HistoricalBattleReportRepository({ seedFile });
  }
  return new FakeBattleReportRepository(undefined, undefined, { delay });
}

export async function getJudgementRepository(
  mode?: PlayMode,
): Promise<JudgementRepository> {
  const { FakeJudgementRepository } = await import(
    '@/yk/repo/repositories.fake'
  );
  const delay = defaultDelayForMode(mode, 'judgement');
  // Tip: add new branches per mode here (e.g., 'demo-2', 'api')
  // if (mode?.id === 'demo-2') {
  //   const { Demo2JudgementRepository } = await import('@/yk/repo/repositories.demo2');
  //   return new Demo2JudgementRepository();
  // }
  if (mode?.id === 'api') {
    const { ApiClient, ApiJudgementRepository } = await import(
      '@/yk/repo/repositories.api'
    );
    const base: string = getApiBaseUrl();
    const api = new ApiClient(base);
    return new ApiJudgementRepository(api);
  }
  return new FakeJudgementRepository({ delay });
}

// Utility to safely access Vite env variables
function getViteEnvVar(key: string): string | undefined {
  // Vite injects env variables into import.meta.env
  // Type assertion is encapsulated here for maintainability
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return env?.[key];
}

function getApiBaseUrl(): string {
  return getViteEnvVar('VITE_API_BASE_URL') ?? '/api';
}
type DelayKind = 'report' | 'judgement';
function defaultDelayForMode(mode?: PlayMode, kind: DelayKind = 'report') {
  if (!mode) return 0;
  switch (mode.id) {
    case 'demo':
      return kind === 'report'
        ? { min: 800, max: 1600 }
        : { min: 100, max: 400 };
    case 'historical-evidence':
      return kind === 'report'
        ? { min: 1200, max: 2500 }
        : { min: 200, max: 800 };
    default:
      return 0;
  }
}
