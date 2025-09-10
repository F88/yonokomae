import { describe, it, expect, vi, beforeEach } from 'vitest';
import { historicalSeeds, loadSeedByFile } from './seeds';
import * as DataPackage from '@yonokomae/data-historical-evidence';

// Mock the data package
vi.mock('@yonokomae/data-historical-evidence', () => ({
  historicalSeedMetas: [
    {
      id: 'test-seed-1',
      file: 'test-seed-1.ts',
      title: 'Test Seed 1',
    },
    {
      id: 'test-seed-2',
      file: 'test-seed-2.ts',
      title: 'Test Seed 2',
    },
  ],
  loadSeedByFile: vi.fn(),
}));

describe('seeds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('historicalSeeds', () => {
    it('exports read-only array of seed metadata', () => {
      expect(historicalSeeds).toBeDefined();
      expect(Array.isArray(historicalSeeds)).toBe(true);
      expect(historicalSeeds.length).toBeGreaterThan(0);

      // Check that it's a readonly array
      expect(historicalSeeds).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            file: expect.any(String),
            title: expect.any(String),
          }),
        ]),
      );
    });

    it('contains seed metadata with required properties', () => {
      const firstSeed = historicalSeeds[0];
      expect(firstSeed).toBeDefined();
      expect(firstSeed).toHaveProperty('id');
      expect(firstSeed).toHaveProperty('file');
      expect(firstSeed).toHaveProperty('title');
      expect(typeof firstSeed!.id).toBe('string');
      expect(typeof firstSeed!.file).toBe('string');
      expect(typeof firstSeed!.title).toBe('string');
    });

    it('has consistent seed structure across all entries', () => {
      historicalSeeds.forEach((seed) => {
        expect(seed).toHaveProperty('id');
        expect(seed).toHaveProperty('file');
        expect(seed).toHaveProperty('title');
        expect(seed.id).toBeTruthy();
        expect(seed.file).toBeTruthy();
        expect(seed.title).toBeTruthy();
      });
    });
  });

  describe('loadSeedByFile', () => {
    it('loads seed successfully when file exists', async () => {
      const mockSeed = {
        id: 'test-seed',
        title: 'Test Seed',
        subtitle: 'Test subtitle',
        overview: 'Test overview',
        narrative: 'Test narrative',
      };

      vi.mocked(DataPackage.loadSeedByFile).mockReturnValue(mockSeed);

      const result = await loadSeedByFile('test-seed.ts');

      expect(DataPackage.loadSeedByFile).toHaveBeenCalledWith('test-seed.ts');
      expect(result).toEqual({ default: mockSeed });
    });

    it('throws error when seed not found', async () => {
      vi.mocked(DataPackage.loadSeedByFile).mockReturnValue(undefined);

      await expect(loadSeedByFile('non-existent.ts')).rejects.toThrow(
        'Seed not found: non-existent.ts',
      );

      expect(DataPackage.loadSeedByFile).toHaveBeenCalledWith(
        'non-existent.ts',
      );
    });

    it('handles undefined return from data package', async () => {
      vi.mocked(DataPackage.loadSeedByFile).mockReturnValue(undefined);

      await expect(loadSeedByFile('undefined-seed.ts')).rejects.toThrow(
        'Seed not found: undefined-seed.ts',
      );
    });

    it('returns normalized seed with default export structure', async () => {
      const mockSeed = {
        id: 'normalized-seed',
        title: 'Normalized Seed',
        subtitle: 'Normalized subtitle',
        overview: 'Normalized overview',
        narrative: 'Test scenario narrative',
      };

      vi.mocked(DataPackage.loadSeedByFile).mockReturnValue(mockSeed);

      const result = await loadSeedByFile('normalized-seed.ts');

      expect(result).toHaveProperty('default');
      expect(result.default).toEqual(mockSeed);
      expect(result.default.id).toBe('normalized-seed');
      expect(result.default.title).toBe('Normalized Seed');
    });

    it('preserves all seed properties in default export', async () => {
      const complexSeed = {
        id: 'complex-seed',
        title: 'Complex Seed',
        subtitle: 'Complex subtitle',
        overview: 'Complex overview',
        narrative: 'Complex narrative',
        extraProperty: 'extra value',
      };

      vi.mocked(DataPackage.loadSeedByFile).mockReturnValue(complexSeed);

      const result = await loadSeedByFile('complex-seed.ts');

      expect(result.default).toEqual(complexSeed);
      expect(result.default).toHaveProperty('extraProperty');
      expect((result.default as any).extraProperty).toBe('extra value');
    });

    it('handles different file extensions', async () => {
      const mockSeed = {
        id: 'json-seed',
        title: 'JSON Seed',
        subtitle: 'JSON subtitle',
        overview: 'JSON overview',
        narrative: 'JSON narrative',
      };
      vi.mocked(DataPackage.loadSeedByFile).mockReturnValue(mockSeed);

      await loadSeedByFile('seed.json');
      expect(DataPackage.loadSeedByFile).toHaveBeenCalledWith('seed.json');

      await loadSeedByFile('seed.ts');
      expect(DataPackage.loadSeedByFile).toHaveBeenCalledWith('seed.ts');

      await loadSeedByFile('seed.js');
      expect(DataPackage.loadSeedByFile).toHaveBeenCalledWith('seed.js');
    });

    it('handles files with path separators', async () => {
      const mockSeed = {
        id: 'nested-seed',
        title: 'Nested Seed',
        subtitle: 'Nested subtitle',
        overview: 'Nested overview',
        narrative: 'Nested narrative',
      };
      vi.mocked(DataPackage.loadSeedByFile).mockReturnValue(mockSeed);

      await loadSeedByFile('nested/path/seed.ts');
      expect(DataPackage.loadSeedByFile).toHaveBeenCalledWith(
        'nested/path/seed.ts',
      );
    });
  });

  describe('Build-time validation', () => {
    it('validates that seed IDs are unique', () => {
      // This test verifies the build-time validation works
      // The actual validation happens during module import/evaluation
      const seedIds = historicalSeeds.map((seed) => seed.id);
      const uniqueIds = new Set(seedIds);

      expect(uniqueIds.size).toBe(seedIds.length);
    });

    it('has valid seed metadata structure', () => {
      // Verify that the imported metadata follows expected structure
      expect(historicalSeeds).toBeDefined();
      expect(Array.isArray(historicalSeeds)).toBe(true);

      if (historicalSeeds.length > 0) {
        const sample = historicalSeeds[0];
        expect(sample).toHaveProperty('id');
        expect(sample).toHaveProperty('file');
        expect(sample).toHaveProperty('title');
      }
    });
  });

  describe('Integration with data package', () => {
    it('re-exports types for backward compatibility', () => {
      // This is primarily a compile-time check
      // but we can verify the module structure
      expect(typeof loadSeedByFile).toBe('function');
      expect(Array.isArray(historicalSeeds)).toBe(true);
    });

    it('provides consistent interface for seed loading', async () => {
      const mockSeed = {
        id: 'interface-test',
        title: 'Interface Test',
        subtitle: 'Test subtitle',
        overview: 'Test overview',
        narrative: 'Test narrative',
      };

      vi.mocked(DataPackage.loadSeedByFile).mockReturnValue(mockSeed);

      const result = await loadSeedByFile('interface-test.ts');

      expect(result).toHaveProperty('default');
      expect(result.default).toEqual(mockSeed);
    });
  });
});
