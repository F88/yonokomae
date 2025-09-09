import { BattleSchema } from '@yonokomae/schema';
import type { Battle } from '@yonokomae/types';
import { describe, expect, it } from 'vitest';
// Explicit .ts to avoid resolving a stale compiled JS sibling if present.
import {
  battleSeeds,
  battleSeedPublishStats,
  publishedBattleSeeds,
} from './index.ts';

describe('Battle Seeds Validation', () => {
  it('should have unique battle IDs', () => {
    const ids = new Map<string, Battle[]>();

    battleSeeds.forEach((battle) => {
      if (!ids.has(battle.id)) {
        ids.set(battle.id, []);
      }
      ids.get(battle.id)!.push(battle);
    });

    const duplicates = Array.from(ids.entries())
      .filter(([, battles]) => battles.length > 1)
      .map(([id, battles]) => ({ id, count: battles.length }));

    if (duplicates.length > 0) {
      const message = duplicates
        .map(({ id, count }) => `  - id: ${id} (${count} occurrences)`)
        .join('\n');
      throw new Error(`Duplicate Battle ids detected:\n${message}`);
    }

    expect(duplicates).toHaveLength(0);
  });

  it('should validate all battles against schema', () => {
    const errors: string[] = [];

    battleSeeds.forEach((battle, index) => {
      try {
        BattleSchema.parse(battle);
      } catch (error) {
        errors.push(`Battle at index ${index} (id: ${battle.id}): ${error}`);
      }
    });

    if (errors.length > 0) {
      throw new Error(`Schema validation errors:\n${errors.join('\n')}`);
    }

    expect(errors).toHaveLength(0);
  });

  it('should have at least one battle', () => {
    expect(battleSeeds.length).toBeGreaterThan(0);
  });

  it('publish stats should be consistent', () => {
    const stats = battleSeedPublishStats();
    expect(stats.total).toBe(battleSeeds.length);
    const sum = Object.values(stats.byState).reduce((a, b) => a + b, 0);
    expect(sum).toBe(stats.total);
    // publishedBattleSeeds should equal count of published state
    expect(publishedBattleSeeds.length).toBe(stats.byState['published'] ?? 0);
  });
});
