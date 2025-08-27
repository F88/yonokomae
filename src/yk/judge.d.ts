/**
 * Judge class for determining the winner between two fighters.
 */
import type { Battle } from 'src/types/types';
import type { PlayMode } from './play-mode';
import type { Winner } from '@/yk/repo/core/repositories';
export declare class Judge {
  name: string;
  mode: PlayMode;
  constructor(name: string, mode: PlayMode);
  determineWinner({ battle }: { battle: Battle }): Promise<Winner>;
}
