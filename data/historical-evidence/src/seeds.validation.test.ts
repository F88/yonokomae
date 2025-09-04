import { describe, it, expect } from 'vitest';
import { HistoricalSeedSchema } from '@yonokomae/schema';
import { historicalSeeds, historicalSeedMetas } from './index.js';

describe('Historical Evidence Seeds Validation', () => {
  it('should have unique seed IDs', () => {
    const ids = new Map<string, string[]>();

    historicalSeedMetas.forEach((meta) => {
      if (!ids.has(meta.id)) {
        ids.set(meta.id, []);
      }
      ids.get(meta.id)!.push(meta.file);
    });

    const duplicates = Array.from(ids.entries())
      .filter(([, files]) => files.length > 1)
      .map(([id, files]) => ({ id, files }));

    if (duplicates.length > 0) {
      const message = duplicates
        .map(
          ({ id, files }) =>
            `  - id: ${id}\n    files:\n${files.map((f) => `      - ${f}`).join('\n')}`,
        )
        .join('\n');
      throw new Error(`Duplicate HistoricalSeed ids detected:\n${message}`);
    }

    expect(duplicates).toHaveLength(0);
  });

  it('should validate all seeds against schema', () => {
    const errors: string[] = [];

    historicalSeeds.forEach((seed, index) => {
      try {
        HistoricalSeedSchema.parse(seed);
      } catch (error) {
        errors.push(`Seed at index ${index} (id: ${seed.id}): ${error}`);
      }
    });

    if (errors.length > 0) {
      throw new Error(`Schema validation errors:\n${errors.join('\n')}`);
    }

    expect(errors).toHaveLength(0);
  });

  it('should have at least one seed', () => {
    expect(historicalSeeds.length).toBeGreaterThan(0);
  });
});
