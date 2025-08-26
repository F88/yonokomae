/**
 * Judge class for determining the winner between two fighters.
 */

import type { Neta } from 'src/types/types';
import type { PlayMode } from './play-mode';

export class Judge {
  name: string;

  // Play mode (e.g. single-player, multiplayer)
  mode: PlayMode;

  constructor(name: string, mode: PlayMode) {
    this.name = name;
    this.mode = mode;
  }

  // Async to allow future API calls; waits 0..5s (0ms in tests)
  async determineWinner({
    yono,
    komae,
  }: {
    yono: Neta;
    komae: Neta;
  }): Promise<string> {
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const isTest =
      typeof process !== 'undefined' && process?.env?.NODE_ENV === 'test';
    const delayMs = isTest ? 0 : Math.floor(Math.random() * 5001);
    await sleep(delayMs);

    if (yono.power > komae.power) {
      return 'YONO';
    } else if (yono.power < komae.power) {
      return 'KOMAE';
    } else {
      return 'DRAW';
    }
  }
}
