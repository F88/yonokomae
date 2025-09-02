import type {
  JudgementRepository,
  Winner,
  Verdict,
} from '../core/repositories';
import type { Battle } from '@/types/types';
import { applyDelay, type DelayOption } from '../core/delay-utils';

export class FakeJudgementRepository implements JudgementRepository {
  private delay?: DelayOption;
  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }
  async determineWinner(
    input: {
      battle: Battle;
      judge: { id: string; name: string; codeName: string };
    },
    options?: { signal?: AbortSignal },
  ): Promise<Verdict> {
    await applyDelay(this.delay, options?.signal);
    const yono = input.battle.yono;
    const komae = input.battle.komae;
    const powerDiff = yono.power - komae.power;
    const winner: Winner =
      powerDiff === 0 ? 'DRAW' : powerDiff > 0 ? 'YONO' : 'KOMAE';
    return { winner, reason: 'power', powerDiff };
  }
}
