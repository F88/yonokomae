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
    '@/yk/repo/mock/repositories.fake'
  );
  const delay = defaultDelayForMode(mode);
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
    return new ApiBattleReportRepository(api);
  }
  if (mode?.id === 'historical-evidences') {
    const { HistoricalEvidencesBattleReportRepository } = await import(
      '@/yk/repo/historical-evidences/repositories.historical-evidences'
    );
    return new HistoricalEvidencesBattleReportRepository({ file: seedFile });
  }
  if (mode?.id === 'historical-evidence') {
    const { BattleReportRandomDataRepository } = await import(
      '@/yk/repo/historical-scenarios/repositories.random-jokes'
    );
    // Selected seed is provided via context; callers pass it here.
    return new BattleReportRandomDataRepository({ seedFile });
  }
  if (mode?.id === 'mixed-nuts') {
    const { BattleReportRandomDataRepository } = await import(
      '@/yk/repo/historical-scenarios/repositories.random-jokes'
    );
    return new BattleReportRandomDataRepository({ seedFile });
  }
  return new FakeBattleReportRepository(undefined, undefined, { delay });
}

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
    return new ApiJudgementRepository(api);
  }
  return new FakeJudgementRepository({ delay });
}

// Utility to safely access Vite env variables
function getViteEnvVar(key: string): string | undefined {
  // Vite injects env variables into import.meta.env
  // Type assertion is encapsulated here for maintainability
  const env = (
    import.meta as unknown as { env?: Record<string, string | undefined> }
  ).env;
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
    case 'historical-evidences':
    case 'mixed-nuts':
      return kind === 'report'
        ? { min: 1200, max: 2500 }
        : { min: 200, max: 800 };
    default:
      return 0;
  }
}
