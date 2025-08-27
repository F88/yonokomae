import type { PlayMode } from '@/yk/play-mode';
import type { JudgementRepository, Winner } from '../core/repositories';
import type { Battle } from '@/types/types';
import { type DelayOption } from '../core/delay-utils';
export declare class FakeJudgementRepository implements JudgementRepository {
    private delay?;
    constructor(options?: {
        delay?: DelayOption;
    });
    determineWinner(input: {
        battle: Battle;
        mode: PlayMode;
        extra?: Record<string, unknown>;
    }, options?: {
        signal?: AbortSignal;
    }): Promise<Winner>;
}
