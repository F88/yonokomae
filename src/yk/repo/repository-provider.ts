import type {
  BattleReportRepository,
  JudgementRepository,
} from './repositories';
import type { PlayMode } from '@/yk/play-mode';

export async function getBattleReportRepository(
  mode?: PlayMode,
): Promise<BattleReportRepository> {
  const { FakeBattleReportRepository } = await import(
    '@/yk/repo/repositories.fake'
  );
  const delay = defaultDelayForMode(mode);
  if (mode?.id === 'historical-evidence') {
    const { HistoricalNetaRepository, HistoricalScenarioRepository } =
      await import('@/yk/repo/repositories.historical');
    return new FakeBattleReportRepository(
      new HistoricalScenarioRepository(),
      new HistoricalNetaRepository(),
      { delay },
    );
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
  return new FakeJudgementRepository({ delay });
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
