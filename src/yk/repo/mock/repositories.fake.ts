import type { PlayMode } from '@/yk/play-mode';
import type { JudgementRepository, Winner, Neta } from '../core/repositories';
import { applyDelay, type DelayOption } from '../core/delay-utils';

export class FakeJudgementRepository implements JudgementRepository {
  private delay?: DelayOption;
  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }
  async determineWinner(
    input: { mode: PlayMode; yono: Neta; komae: Neta },
    options?: { signal?: AbortSignal },
  ): Promise<Winner> {
    await applyDelay(this.delay, options?.signal);
    const { yono, komae } = input;
    if (yono.power > komae.power) return 'YONO';
    if (yono.power < komae.power) return 'KOMAE';
    return 'DRAW';
  }
}
