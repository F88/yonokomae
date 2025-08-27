/**
 * Judge class for determining the winner between two fighters.
 */

import type { Battle, Neta } from 'src/types/types';
import type { PlayMode } from './play-mode';
import { getJudgementRepository } from '@/yk/repo/core/repository-provider';
import type { Winner } from '@/yk/repo/core/repositories';

export class Judge {
  name: string;

  // Play mode (e.g. single-player, multiplayer)
  mode: PlayMode;

  constructor(name: string, mode: PlayMode) {
    this.name = name;
    this.mode = mode;
  }

  // Async to allow future API calls; delay is handled in repository layer now
  async determineWinner({
    yono,
    komae,
    battle,
  }: {
    yono: Neta;
    komae: Neta;
    battle: Battle;
  }): Promise<Winner> {
    // Delegate to repository layer (handles delays and strategy per mode)
    const repo = await getJudgementRepository(this.mode);
    const fullBattle: Battle = {
      ...battle,
      yono,
      komae,
    };
    return repo.determineWinner({ battle: fullBattle, mode: this.mode });
  }
}
