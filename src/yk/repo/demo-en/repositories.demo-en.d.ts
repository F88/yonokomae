import type {
  BattleReportRepository,
  JudgementRepository,
  Winner,
  PlayMode,
} from '@/yk/repo/core/repositories';
import type { Battle } from '@/types/types';
import { type DelayOption } from '../core/delay-utils';
/**
 * DemoEnBattleReportRepository
 *
 * Language-specific demo repository for the 'demo-en' play mode.
 *
 * - Returns English-only demo battle data (title, subtitle, narrative).
 * - Seeds are inspired by English scenario seeds under
 *   `src/seeds/random-data/scenario/*.en.ts`.
 * - Kept separate to allow divergence without affecting other demo modes.
 *
 * @remarks
 * This repository intentionally produces witty, clearly humorous content
 * for demonstration. All strings are in English by design.
 */
export declare class DemoEnBattleReportRepository
  implements BattleReportRepository
{
  private delay?;
  constructor(options?: { delay?: DelayOption });
  generateReport(options?: { signal?: AbortSignal }): Promise<Battle>;
}
/**
 * DemoEnJudgementRepository
 *
 * Language-specific demo repository for the 'demo-en' play mode.
 *
 * - Returns judgement outputs aligned to English demo data.
 * - Kept separate to allow divergence without affecting other modes.
 *
 * @remarks
 * This repository belongs to 'demo-en' and expects English data.
 */
export declare class DemoEnJudgementRepository implements JudgementRepository {
  private delay?;
  constructor(options?: { delay?: DelayOption });
  determineWinner(
    input: {
      battle: Battle;
      mode: PlayMode;
      extra?: Record<string, unknown>;
    },
    options?: {
      signal?: AbortSignal;
    },
  ): Promise<Winner>;
}
