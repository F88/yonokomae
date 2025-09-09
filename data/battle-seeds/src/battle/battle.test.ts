import { BattleSchema } from '@yonokomae/schema';
import type { Battle } from '@yonokomae/types';
import { describe, expect, it, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function listBattleFilesRecursive(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '__generated') continue;
      out.push(...listBattleFilesRecursive(full));
    } else if (entry.isFile() && entry.name.endsWith('.ja.ts')) {
      out.push(full);
    }
  }
  return out;
}

// Collect relative basenames (keep file names only for naming tests)
const battleFilePaths = listBattleFilesRecursive(__dirname);
const battleFiles = battleFilePaths.map((p) => path.basename(p));

describe('Battle Source Files', () => {
  describe('File Structure', () => {
    it('should have battle files', () => {
      expect(battleFiles.length).toBeGreaterThan(0);
    });

    it('should follow naming convention', () => {
      battleFiles.forEach((file) => {
        expect(file).toMatch(/^[a-z0-9-]+\.ja\.ts$/);
      });
    });

    it('should have a reasonable diversity of files (>= 20)', () => {
      expect(battleFiles.length).toBeGreaterThanOrEqual(20);
    });
  });

  // Load all battles (published + drafts) dynamically by path
  const loadedBattles: { file: string; battle: Battle }[] = [];
  beforeAll(async () => {
    for (const abs of battleFilePaths) {
      const rel = './' + path.relative(__dirname, abs).replace(/\\/g, '/');
      const mod = await import(rel);
      loadedBattles.push({ file: path.basename(abs), battle: mod.default });
    }
  });

  describe('Battle Data Validation', () => {
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
        expect(typeof battle.id).toBe('string');
        expect(battle.id.length).toBeGreaterThan(0);
      });
    });

    it('should have unique IDs', () => {
      const ids = loadedBattles.map(({ battle }) => battle.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });
  });

  describe('Battle Categories Coverage', () => {
    it('should cover multiple themes (>=5)', () => {
      const themes = new Set(loadedBattles.map(({ battle }) => battle.themeId));
      expect(themes.size).toBeGreaterThanOrEqual(5);
    });
  });
});
