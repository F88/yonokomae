import type { PlayMode } from '@/yk/play-mode';
import type { JudgementRepository, Winner, Neta } from '../core/repositories';
import { applyDelay, type DelayOption } from '../core/delay-utils';

export class FakeJudgementRepository implements JudgementRepository {
  private delay?: DelayOption;
  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }
  async determineWinner(
    input: {
      battle: { yono: Neta; komae: Neta };
      mode: PlayMode;
      extra?: Record<string, unknown>;
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
