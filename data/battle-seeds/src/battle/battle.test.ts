import { BattleSchema } from '@yonokomae/schema';
import type { Battle } from '@yonokomae/types';
import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Battle Source Files', () => {
  const battleFiles = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith('.ja.ts') && !file.includes('.test.'));

  describe('File Structure', () => {
    it('should have battle files', () => {
      expect(battleFiles.length).toBeGreaterThan(0);
    });

    it('should follow naming convention', () => {
      battleFiles.forEach((file) => {
        expect(file).toMatch(/^[a-z-]+\.ja\.ts$/);
      });
    });

    it('should have expected battle files', () => {
      const expectedBattles = [
        'celebrity-battle.ja.ts',
        'showa-superstar-battle.ja.ts',
        'edo-era-heroes.ja.ts',
        'sengoku-territory.ja.ts',
        'ancient-life-battle.ja.ts',
        'ruins-battle.ja.ts',
        'development-battle.ja.ts',
        'flood-battle.ja.ts',
        'transportation-hub-battle.ja.ts',
        'culture-battle.ja.ts',
        'density-battle.ja.ts',
        'ikada-race.ja.ts',
        'civic-tech-battle.ja.ts',
        'coder-dojo-battle.ja.ts',
        'robot-ethics.ja.ts',
        'sns-truth-vs-lies.ja.ts',
        'wikipedia-ja-battle.ja.ts',
        'city-name-origin.ja.ts',
      ];

      expectedBattles.forEach((fileName) => {
        expect(battleFiles).toContain(fileName);
      });
    });
  });

  describe('Battle Data Validation', () => {
    const loadedBattles: { file: string; battle: Battle }[] = [];

    // Dynamically import and validate each battle
    beforeAll(async () => {
      for (const file of battleFiles) {
        try {
          const module = await import(`./${file}`);
          loadedBattles.push({ file, battle: module.default });
        } catch (error) {
          console.error(`Failed to load ${file}:`, error);
        }
      }
    });

    it('should load all battle files successfully', () => {
      expect(loadedBattles.length).toBe(battleFiles.length);
    });

    it('should export default Battle object', () => {
      loadedBattles.forEach(({ battle }) => {
        expect(battle).toBeDefined();
        expect(typeof battle).toBe('object');
      });
    });

    it('should have valid Battle structure', () => {
      loadedBattles.forEach(({ file, battle }) => {
        try {
          BattleSchema.parse(battle);
        } catch (error) {
          throw new Error(
            `Battle in ${file} failed schema validation: ${error}`,
          );
        }
      });
    });

    it('should have meaningful battle IDs', () => {
      loadedBattles.forEach(({ battle }) => {
        expect(battle.id).toBeDefined();
        expect(battle.id.length).toBeGreaterThan(0);
        expect(typeof battle.id).toBe('string');
      });
    });

    it('should have unique IDs', () => {
      const ids = loadedBattles.map(({ battle }) => battle.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should have valid significance levels', () => {
      const validLevels = ['low', 'medium', 'high', 'legendary'];
      loadedBattles.forEach(({ battle }) => {
        expect(validLevels).toContain(battle.significance);
      });
    });

    it('should have valid theme IDs', () => {
      loadedBattles.forEach(({ battle }) => {
        expect(battle.themeId).toBeDefined();
        expect(battle.themeId.length).toBeGreaterThan(0);
        expect(typeof battle.themeId).toBe('string');
      });
    });

    it('should have balanced power values', () => {
      loadedBattles.forEach(({ battle }) => {
        expect(battle.komae.power).toBeGreaterThanOrEqual(0);
        expect(battle.komae.power).toBeLessThanOrEqual(1000000);
        expect(battle.yono.power).toBeGreaterThanOrEqual(0);
        expect(battle.yono.power).toBeLessThanOrEqual(1000000);
      });
    });
  });

  describe('Japanese Content Quality', () => {
    const loadedBattles: { file: string; battle: Battle }[] = [];

    beforeAll(async () => {
      for (const file of battleFiles) {
        const module = await import(`./${file}`);
        loadedBattles.push({ file, battle: module.default });
      }
    });

    it('should have meaningful titles', () => {
      loadedBattles.forEach(({ battle }) => {
        expect(battle.title).toBeDefined();
        expect(battle.title.length).toBeGreaterThan(0);
        expect(typeof battle.title).toBe('string');
      });
    });

    it('should have substantial narrative content', () => {
      loadedBattles.forEach(({ battle }) => {
        expect(battle.narrative.overview.length).toBeGreaterThan(20);
        expect(battle.narrative.scenario.length).toBeGreaterThan(50);
      });
    });

    it('should have descriptive content for both sides', () => {
      loadedBattles.forEach(({ battle }) => {
        expect(battle.komae.description.length).toBeGreaterThan(20);
        expect(battle.yono.description.length).toBeGreaterThan(20);
      });
    });
  });

  describe('Provenance Data', () => {
    const loadedBattles: { file: string; battle: Battle }[] = [];

    beforeAll(async () => {
      for (const file of battleFiles) {
        const module = await import(`./${file}`);
        loadedBattles.push({ file, battle: module.default });
      }
    });

    it('should have valid provenance structure if present', () => {
      loadedBattles.forEach(({ battle }) => {
        if (battle.provenance) {
          expect(Array.isArray(battle.provenance)).toBe(true);

          battle.provenance.forEach((source) => {
            expect(source).toBeDefined();
            expect(typeof source).toBe('object');
            if (source.url) {
              expect(source.url).toMatch(/^https?:\/\//);
            }
          });
        }
      });
    });
  });

  describe('TypeScript Compliance', () => {
    const loadedBattles: { file: string; battle: Battle }[] = [];

    beforeAll(async () => {
      for (const file of battleFiles) {
        const module = await import(`./${file}`);
        loadedBattles.push({ file, battle: module.default });
      }
    });

    it('should satisfy Battle type', () => {
      loadedBattles.forEach(({ battle }) => {
        const typeCheck: Battle = battle;
        expect(typeCheck).toBeDefined();
      });
    });

    it('should have success status', () => {
      loadedBattles.forEach(({ battle }) => {
        expect(battle.status).toBe('success');
      });
    });

    it('should have valid image URLs', () => {
      loadedBattles.forEach(({ battle }) => {
        expect(battle.komae.imageUrl).toBeDefined();
        expect(battle.komae.imageUrl.length).toBeGreaterThan(0);
        expect(battle.yono.imageUrl).toBeDefined();
        expect(battle.yono.imageUrl.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Historical Battles (HWMB)', () => {
    const loadedBattles: { file: string; battle: Battle }[] = [];

    beforeAll(async () => {
      for (const file of battleFiles) {
        const module = await import(`./${file}`);
        loadedBattles.push({ file, battle: module.default });
      }
    });

    it('should have legendary significance battles with valid themes', async () => {
      const legendaryBattles = loadedBattles.filter(
        ({ battle }) => battle.significance === 'legendary',
      );

      if (legendaryBattles.length > 0) {
        legendaryBattles.forEach(({ battle }) => {
          expect(battle.significance).toBe('legendary');
          expect(battle.themeId).toBeDefined();
          expect(battle.themeId.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Battle Categories Coverage', () => {
    const loadedBattles: { file: string; battle: Battle }[] = [];

    beforeAll(async () => {
      for (const file of battleFiles) {
        const module = await import(`./${file}`);
        loadedBattles.push({ file, battle: module.default });
      }
    });

    it('should cover multiple themes', () => {
      const themes = new Set(loadedBattles.map(({ battle }) => battle.themeId));
      expect(themes.size).toBeGreaterThanOrEqual(5);
    });

    it('should have varied significance levels', () => {
      const significances = new Set(
        loadedBattles.map(({ battle }) => battle.significance),
      );
      expect(significances.size).toBeGreaterThanOrEqual(2);
    });

    it('should have balanced distribution of power', () => {
      const averageKomaePower =
        loadedBattles.reduce((sum, { battle }) => sum + battle.komae.power, 0) /
        loadedBattles.length;
      const averageYonoPower =
        loadedBattles.reduce((sum, { battle }) => sum + battle.yono.power, 0) /
        loadedBattles.length;

      // Powers should be roughly balanced overall
      const ratio = averageKomaePower / averageYonoPower;
      expect(ratio).toBeGreaterThan(0.8);
      expect(ratio).toBeLessThan(1.2);
    });
  });
});
