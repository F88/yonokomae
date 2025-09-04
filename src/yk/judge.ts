/**
 * Judge class for determining the winner between two fighters.
 */

import type { Battle } from '@yonokomae/types';
import type { PlayMode } from './play-mode';
import { getJudgementRepository } from '@/yk/repo/core/repository-provider';
import type { Verdict } from '@/yk/repo/core/repositories';

export class Judge {
  id: string;
  name: string;
  codeName: string;

  constructor(id: string, name: string, codeName: string) {
    this.id = id;
    this.name = name;
    this.codeName = codeName;
  }

  // Async to allow future API calls; delay is handled in repository layer now
  async determineWinner({
    battle,
    mode,
  }: {
    battle: Battle;
    mode: PlayMode;
  }): Promise<Verdict> {
    // Delegate to repository layer (handles delays and strategy per mode)
    const repo = await getJudgementRepository(mode);
    // Propagate judge identifier to allow per-judge individuality downstream
    return repo.determineWinner({
      battle,
      judge: { id: this.id, name: this.name, codeName: this.codeName },
    });
  }
}
