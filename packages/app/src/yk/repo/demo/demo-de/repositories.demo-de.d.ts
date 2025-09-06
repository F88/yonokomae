import type {
  BattleReportRepository,
  JudgementRepository,
  Verdict,
  JudgeIdentity,
  Battle,
} from '../../core/repositories';
import { type DelayOption } from '../../core/delay-utils';
/**
 * DemoDeBattleReportRepository
 *
 * Language-specific demo repository for the 'demo-de' play mode.
 *
 * - Returns German (Deutsch) demo battle data: titles, subtitles, narrative.
 * - All strings produced by this repository are in German.
 * - Inspired by English seeds but localized to DE; no special markers embedded.
 * - Separated to allow divergence without affecting other modes.
 */
export declare class DemoDeBattleReportRepository
  implements BattleReportRepository
{
  private delay?;
  constructor(options?: { delay?: DelayOption });
  generateReport(options?: { signal?: AbortSignal }): Promise<Battle>;
}
/**
 * DemoDeJudgementRepository
 *
 * Language-specific demo repository for the 'demo-de' play mode.
 *
 * - Returns judgement aligned with German-localized demo content.
 * - All outputs are language-agnostic enums, but this repo belongs to DE mode.
 * - Kept separate to allow independent evolution from other modes.
 */
export declare class DemoDeJudgementRepository implements JudgementRepository {
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
