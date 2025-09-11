import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  loadBattleFromSeeds,
  normalizeBattle,
  type BattleModule,
  BattleSeedNotFoundError,
  BattleSeedValidationError,
} from './battle-seed-loader';

// Mock the dependencies
vi.mock('@/lib/id', () => ({
  uid: vi.fn(() => 'test-battle-id'),
}));

vi.mock('@yonokomae/data-battle-seeds', () => ({
  battleSeeds: [
    {
      id: 'test-battle-1',
      title: 'Test Battle',
      themeId: 'history',
      significance: 'high',
      yono: { title: 'YONO', power: 100 },
      komae: { title: 'KOMAE', power: 90 },
    },
    {
      id: 'test-battle-2',
      title: 'Another Battle',
      themeId: 'culture',
      significance: 'medium',
      yono: { title: 'YONO 2', power: 80 },
      komae: { title: 'KOMAE 2', power: 85 },
    },
  ],
  battleSeedsByFile: {
    'test-battle-1.json': {
      id: 'test-battle-1',
      title: 'Test Battle',
    },
    'another-battle.json': {
      id: 'test-battle-2',
      title: 'Another Battle',
    },
  },
}));

vi.mock('@yonokomae/schema', () => ({
  BattleSchema: {
    safeParse: vi.fn((data) => ({
      success: true,
      data: data,
    })),
  },
}));

describe('battle-seed-loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadBattleFromSeeds', () => {
    it('loads a battle from available seeds', async () => {
      const result = await loadBattleFromSeeds({
        roots: ['@yonokomae/data-battle-seeds/'],
      });

      expect(result).toBeDefined();
      expect(result.id).toBeTruthy();
      expect(result.title).toBeTruthy();
    });

    it('loads a specific battle when file is provided', async () => {
      const result = await loadBattleFromSeeds({
        roots: ['@yonokomae/data-battle-seeds/'],
        file: 'test-battle-1.json',
      });

      expect(result.id).toBe('test-battle-1');
      expect(result.title).toBe('Test Battle');
    });

    it('throws error when no battles found for given roots', async () => {
      await expect(
        loadBattleFromSeeds({
          roots: ['/nonexistent-root/'],
        }),
      ).rejects.toThrow('No battle seeds found under: /nonexistent-root/');
      try {
        await loadBattleFromSeeds({ roots: ['/nonexistent-root/'] });
        expect.unreachable();
      } catch (e) {
        expect(e).toBeInstanceOf(BattleSeedNotFoundError);
        expect((e as Error).name).toBe('BattleSeedNotFoundError');
      }
    });

    it('throws error when specific file not found', async () => {
      await expect(
        loadBattleFromSeeds({
          roots: ['@yonokomae/data-battle-seeds/'],
          file: 'nonexistent-file.json',
        }),
      ).rejects.toThrow('Battle not found: nonexistent-file.json');
      try {
        await loadBattleFromSeeds({
          roots: ['@yonokomae/data-battle-seeds/'],
          file: 'nonexistent-file.json',
        });
        expect.unreachable();
      } catch (e) {
        expect(e).toBeInstanceOf(BattleSeedNotFoundError);
      }
    });

    it('throws error when battle data is invalid', async () => {
      const mockSchema = await import('@yonokomae/schema');
      // Make every invocation in this test return a validation failure so we can
      // assert both the rejection message and the error class via a second call.
      vi.mocked(mockSchema.BattleSchema.safeParse).mockImplementation(
        () =>
          ({
            success: false,
            error: {
              issues: [
                { path: ['title'], message: 'Required' },
                { path: ['power'], message: 'Invalid number' },
              ],
            },
          }) as unknown as ReturnType<typeof mockSchema.BattleSchema.safeParse>,
      );

      await expect(
        loadBattleFromSeeds({
          roots: ['@yonokomae/data-battle-seeds/'],
          file: 'test-battle-1.json',
        }),
      ).rejects.toThrow(
        'Invalid Battle data: title: Required; power: Invalid number',
      );
      try {
        await loadBattleFromSeeds({
          roots: ['@yonokomae/data-battle-seeds/'],
          file: 'test-battle-1.json',
        });
        expect.unreachable();
      } catch (e) {
        expect(e).toBeInstanceOf(BattleSeedValidationError);
        expect((e as Error).name).toBe('BattleSeedValidationError');
      }
    });

    it('works with legacy filesystem-style roots', async () => {
      const result = await loadBattleFromSeeds({
        roots: ['/seeds/historical-evidences/battle/'],
        file: 'test-battle-1.json',
      });

      expect(result.id).toBe('test-battle-1');
    });
  });

  describe('normalizeBattle', () => {
    it('normalizes a complete battle module with default export', () => {
      const moduleWithDefault: BattleModule = {
        default: {
          id: 'test-id',
          title: 'Test Title',
          subtitle: 'Test Subtitle',
          narrative: {
            overview: 'Test overview',
            scenario: 'Test scenario',
          },
          themeId: 'culture',
          significance: 'high',
          yono: {
            title: 'YONO',
            subtitle: 'yono subtitle',
            description: 'yono desc',
            power: 100,
            imageUrl: 'yono.jpg',
          },
          komae: {
            title: 'KOMAE',
            subtitle: 'komae subtitle',
            description: 'komae desc',
            power: 90,
            imageUrl: 'komae.jpg',
          },
          provenance: ['source1', 'source2'],
          status: 'success',
        },
      };

      const result = normalizeBattle(moduleWithDefault);

      expect(result.id).toBe('test-id');
      expect(result.title).toBe('Test Title');
      expect(result.subtitle).toBe('Test Subtitle');
      expect(result.narrative.overview).toBe('Test overview');
      expect(result.narrative.scenario).toBe('Test scenario');
      expect(result.themeId).toBe('culture');
      expect(result.significance).toBe('high');
      expect(result.yono.title).toBe('YONO');
      expect(result.yono.power).toBe(100);
      expect(result.komae.title).toBe('KOMAE');
      expect(result.komae.power).toBe(90);
      expect(result.provenance).toEqual(['source1', 'source2']);
      expect(result.status).toBe('success');
    });

    it('normalizes a battle module without default export', () => {
      const directModule: BattleModule = {
        id: 'direct-id',
        title: 'Direct Title',
        yono: { title: 'YONO', power: 75 },
        komae: { title: 'KOMAE', power: 80 },
      };

      const result = normalizeBattle(directModule);

      expect(result.id).toBe('direct-id');
      expect(result.title).toBe('Direct Title');
    });

    it('provides default values for missing fields', () => {
      const minimalModule: BattleModule = {};

      const result = normalizeBattle(minimalModule);

      expect(result.id).toBe('test-battle-id'); // From mocked uid()
      expect(result.title).toBe('');
      expect(result.subtitle).toBe('');
      expect(result.narrative.overview).toBe('');
      expect(result.narrative.scenario).toBe('');
      expect(result.themeId).toBe('history');
      expect(result.significance).toBe('low');
      expect(result.status).toBe('success');
      expect(result.provenance).toEqual([]);
    });

    it('handles legacy overview/scenario fields', () => {
      const legacyModule: BattleModule = {
        overview: 'Legacy overview',
        scenario: 'Legacy scenario',
      } as unknown as BattleModule;

      const result = normalizeBattle(legacyModule);

      expect(result.narrative.overview).toBe('Legacy overview');
      expect(result.narrative.scenario).toBe('Legacy scenario');
    });

    it('prefers narrative fields over legacy fields', () => {
      const mixedModule: BattleModule = {
        overview: 'Legacy overview',
        scenario: 'Legacy scenario',
        narrative: {
          overview: 'New overview',
          scenario: 'New scenario',
        },
      } as unknown as BattleModule;

      const result = normalizeBattle(mixedModule);

      expect(result.narrative.overview).toBe('New overview');
      expect(result.narrative.scenario).toBe('New scenario');
    });

    it('normalizes Neta objects with defaults', () => {
      const moduleWithPartialNeta: BattleModule = {
        yono: {
          title: 'YONO Title',
          // Missing other fields
        },
        komae: {
          title: 'KOMAE Title',
          power: 120,
          // Missing other fields
        },
      };

      const result = normalizeBattle(moduleWithPartialNeta);

      expect(result.yono).toEqual({
        title: 'YONO Title',
        subtitle: '',
        description: '',
        power: 50,
        imageUrl: 'about:blank',
      });

      expect(result.komae).toEqual({
        title: 'KOMAE Title',
        subtitle: '',
        description: '',
        power: 120,
        imageUrl: 'about:blank',
      });
    });

    it('handles undefined neta objects', () => {
      const moduleWithoutNeta: BattleModule = {
        // No yono or komae
      };

      const result = normalizeBattle(moduleWithoutNeta);

      expect(result.yono).toEqual({
        title: '',
        subtitle: '',
        description: '',
        power: 50,
        imageUrl: 'about:blank',
      });

      expect(result.komae).toEqual({
        title: '',
        subtitle: '',
        description: '',
        power: 50,
        imageUrl: 'about:blank',
      });
    });

    it('handles non-array provenance', () => {
      const moduleWithInvalidProvenance: BattleModule = {
        provenance: 'not an array' as unknown as string[],
      };

      const result = normalizeBattle(moduleWithInvalidProvenance);

      expect(result.provenance).toEqual([]);
    });

    it('handles invalid power values', () => {
      const moduleWithInvalidPower: BattleModule = {
        yono: {
          title: 'YONO',
          power: 'not a number' as unknown as number,
        },
        komae: {
          title: 'KOMAE',
          power: null as unknown as number,
        },
      };

      const result = normalizeBattle(moduleWithInvalidPower);

      expect(result.yono.power).toBe(50); // Default value
      expect(result.komae.power).toBe(50); // Default value
    });
  });
});
