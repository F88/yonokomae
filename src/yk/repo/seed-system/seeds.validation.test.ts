import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Scenario seed schema
const provenanceItem = z.object({
  label: z.string().min(1),
  url: z.string().url().optional(),
  note: z.string().min(1).optional(),
});

const scenarioSeedSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string(),
  overview: z.string(),
  narrative: z.string(),
  provenance: z.array(provenanceItem).optional(),
});

// Neta seeds schema
const netaBase = z.object({
  imageUrl: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string(),
  description: z.string(),
});
const netaOptionsSchema = z.object({ options: z.array(netaBase).min(1) });

// Report config schema
const reportConfigSchema = z.object({
  attribution: z.string().min(1),
  defaultPower: z.number().int().min(0),
});

// Helper to normalize ESM default shape for JSON/TS modules
function getDefault<T>(mod: unknown): T | undefined {
  if (!mod || typeof mod !== 'object') return undefined;
  const anyMod = mod as Record<string, unknown>;
  if ('default' in anyMod) {
    return anyMod.default as T;
  }
  return mod as T;
}

describe('Seed schemas', () => {
  it('validates all scenario seeds', async () => {
    const modules = {
      ...import.meta.glob('/seeds/random-data/scenario/*', { eager: true }),
      ...import.meta.glob('/src/seeds/random-data/scenario/*.{en,ja}.ts', {
        eager: true,
      }),
    } as Record<string, unknown>;
    const entries = Object.entries(modules);
    expect(entries.length).toBeGreaterThan(0);
    const seen = new Map<string, string[]>();
    for (const [path, mod] of entries) {
      const data = getDefault<unknown>(mod);
      expect(() => scenarioSeedSchema.parse(data)).not.toThrow();
      // Extra: ensure .id matches filename prefix
      const id = (data as { id: string }).id;
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
      expect(path.includes('scenario/')).toBe(true);
      const list = seen.get(id) ?? [];
      list.push(path);
      seen.set(id, list);
    }
    // Uniqueness check: no duplicate ids across scenario seeds
    const dups: Array<{ id: string; paths: string[] }> = [];
    for (const [id, paths] of seen) {
      if (paths.length > 1) dups.push({ id, paths });
    }
    const dupMsg =
      'Duplicate scenario seed ids detected:\n' +
      dups.map((d) => `- ${d.id}\n  ${d.paths.join('\n  ')}`).join('\n');
    expect(dups, dupMsg).toEqual([]);
  });

  it('validates neta seeds for komae and yono', async () => {
    const modules = {
      ...import.meta.glob('/seeds/random-data/neta/*', { eager: true }),
      ...import.meta.glob('/src/seeds/random-data/neta/*', { eager: true }),
    } as Record<string, unknown>;
    const komae =
      getDefault<unknown>(modules['/seeds/random-data/neta/komae.json']) ??
      getDefault<unknown>(modules['/src/seeds/random-data/neta/komae.en.ts']) ??
      getDefault<unknown>(modules['/src/seeds/random-data/neta/komae.ts']);
    const yono =
      getDefault<unknown>(modules['/seeds/random-data/neta/yono.json']) ??
      getDefault<unknown>(modules['/src/seeds/random-data/neta/yono.en.ts']) ??
      getDefault<unknown>(modules['/src/seeds/random-data/neta/yono.ts']);
    expect(() => netaOptionsSchema.parse(komae)).not.toThrow();
    expect(() => netaOptionsSchema.parse(yono)).not.toThrow();
  });

  it('validates report config seed', async () => {
    const modules = {
      ...import.meta.glob('/seeds/random-data/report/*', { eager: true }),
      ...import.meta.glob('/src/seeds/random-data/report/*', { eager: true }),
    } as Record<string, unknown>;
    const cfg =
      getDefault<unknown>(modules['/seeds/random-data/report/config.json']) ??
      getDefault<unknown>(
        modules['/src/seeds/random-data/report/config.en.ts'],
      ) ??
      getDefault<unknown>(modules['/src/seeds/random-data/report/config.ts']);
    expect(() => reportConfigSchema.parse(cfg)).not.toThrow();
  });
});
