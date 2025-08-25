/**
 * Judge class for determining the winner between two fighters.
 */

import type { Neta } from 'src/types/types';

export class Judge {
  name: string;

  constructor(name: string) {
    this.name = name;
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
      return 'YONO wins!';
    } else if (yono.power < komae.power) {
      return 'KOMAE wins!';
    } else {
      return "It's a tie!";
    }
  }
}
