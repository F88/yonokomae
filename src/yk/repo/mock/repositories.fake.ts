import type { JudgementRepository, Winner } from '../core/repositories';
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
  ): Promise<Winner> {
    await applyDelay(this.delay, options?.signal);
    const yono = input.battle.yono;
    const komae = input.battle.komae;
    if (yono.power > komae.power) return 'YONO';
    if (yono.power < komae.power) return 'KOMAE';
    return 'DRAW';
  }
}
