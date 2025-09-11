import type { Battle } from '@yonokomae/types';

// Runtime guard to ensure a battle is renderable (non-null and has a non-empty id)
export function isRenderableBattle(
  battle: Battle | null | undefined,
): battle is Battle {
  return Boolean(battle && typeof battle.id === 'string' && battle.id !== '');
}
