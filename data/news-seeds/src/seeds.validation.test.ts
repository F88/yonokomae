import { describe, it, expect } from 'vitest';
import { BattleSchema } from '@yonokomae/schema';
import { newsSeeds } from './index.js';

describe('News Seeds Validation', () => {
  it('should have unique news seed IDs', () => {
    const ids = new Map<string, Battle[]>();

    newsSeeds.forEach((seed) => {
      if (!ids.has(seed.id)) {
        ids.set(seed.id, []);
      }
      ids.get(seed.id)!.push(seed);
    });

    const duplicates = Array.from(ids.entries())
      .filter(([, seeds]) => seeds.length > 1)
      .map(([id, seeds]) => ({ id, count: seeds.length }));

    if (duplicates.length > 0) {
      const message = duplicates
        .map(({ id, count }) => `  - id: ${id} (${count} occurrences)`)
        .join('\n');
      throw new Error(`Duplicate News seed ids detected:\n${message}`);
    }

    expect(duplicates).toHaveLength(0);
  });

  it('should validate all news seeds against battle schema', () => {
    const errors: string[] = [];

    newsSeeds.forEach((seed, index) => {
      try {
        BattleSchema.parse(seed);
      } catch (error) {
        errors.push(`News seed at index ${index} (id: ${seed.id}): ${error}`);
      }
    });

    if (errors.length > 0) {
      throw new Error(`Schema validation errors:\n${errors.join('\n')}`);
    }

    expect(errors).toHaveLength(0);
  });

  it('should have at least one news seed', () => {
    expect(newsSeeds.length).toBeGreaterThan(0);
  });
});
