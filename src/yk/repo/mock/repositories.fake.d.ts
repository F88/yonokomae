import type {
  JudgementRepository,
  Verdict,
  JudgeIdentity,
  Battle,
} from '../core/repositories';
import { type DelayOption } from '../core/delay-utils';
export declare class FakeJudgementRepository implements JudgementRepository {
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
