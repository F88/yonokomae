import { describe, it, expect } from 'vitest';
import { BattleSchema } from '@yonokomae/schema';
import { battleSeeds } from './index.js';

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
});
