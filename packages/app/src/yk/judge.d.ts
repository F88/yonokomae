/**
 * Judge class for determining the winner between two fighters.
 */
import type { Battle } from '@yonokomae/types';
import type { PlayMode } from './play-mode';
import type { Verdict } from './repo/core/repositories';
export declare class Judge {
  id: string;
  name: string;
  codeName: string;
  constructor(id: string, name: string, codeName: string);
  determineWinner({
    battle,
    mode,
  }: {
    battle: Battle;
    mode: PlayMode;
  }): Promise<Verdict>;
}
