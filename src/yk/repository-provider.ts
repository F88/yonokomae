import type { BattleReportRepository, JudgementRepository } from '@/yk/repositories';
import type { PlayMode } from '@/yk/play-mode';

/** Return a BattleReportRepository based on play mode. */
export async function getBattleReportRepository(mode?: PlayMode): Promise<BattleReportRepository> {
  const { FakeBattleReportRepository } = await import('@/yk/repositories.fake');
  const delay = defaultDelayForMode(mode);
  return new FakeBattleReportRepository(undefined, undefined, { delay });
}

/** Return a JudgementRepository based on play mode. */
export async function getJudgementRepository(mode?: PlayMode): Promise<JudgementRepository> {
  const { FakeJudgementRepository } = await import('@/yk/repositories.fake');
  const delay = defaultDelayForMode(mode, 'judgement');
  return new FakeJudgementRepository({ delay });
}

type DelayKind = 'report' | 'judgement';
function defaultDelayForMode(mode?: PlayMode, kind: DelayKind = 'report') {
  // Basic defaults by mode; tune as needed
  if (!mode) return 0;
  switch (mode.id) {
    case 'demo':
      return kind === 'report' ? { min: 800, max: 1600 } : { min: 100, max: 400 };
    case 'historical-evidence':
      return kind === 'report' ? { min: 1200, max: 2500 } : { min: 200, max: 800 };
    default:
      return 0;
  }
}
