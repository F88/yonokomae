import type {
  BattleReportRepository,
  JudgementRepository,
  Verdict,
  JudgeIdentity,
  Battle,
} from '../../core/repositories';
import { type DelayOption } from '../../core/delay-utils';
/**
 * DemoEnBattleReportRepository
 *
 * Language-specific demo repository for the 'demo-en' play mode.
 *
 * - Returns English-only demo battle data (title, subtitle, narrative).
 * - Seeds are inspired by English scenario seeds under
 *   `@yonokomae/data-historical-evidence` package.
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
      judge: JudgeIdentity;
    },
    options?: {
      signal?: AbortSignal;
    },
  ): Promise<Verdict>;
}
