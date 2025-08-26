import { uid } from '@/lib/id';
import type { Battle, Neta } from '@/types/types';
import type { BattleReportRepository } from '@/yk/repo/core/repositories';
import { z } from 'zod';

/**
 * HistoricalEvidencesBattleReportRepository
 *
 * 史実的な戦闘データを提供するリポジトリ実装。
 *
 * Battle 単位で用意されたデータファイルを読み取って返す
 *
 * 対応フォーマット:
 * - JSON:  seeds/historical-evidences/battle/*.json で Battle 互換オブジェクトを default でエクスポート
 * - TS:    src/seeds/historical-evidences/battle/*.ts で Battle 互換オブジェクトを default でエクスポート
 */
export class HistoricalEvidencesBattleReportRepository
  implements BattleReportRepository
{
  private readonly file?: string;

  constructor(opts?: { file?: string }) {
    this.file = opts?.file;
  }

  async generateReport(): Promise<Battle> {
    const all = discoverBattleFiles();
    if (all.length === 0) {
      throw new Error(
        'No historical battle files found under seeds/historical-evidences/battle or src/seeds/historical-evidences/battle',
      );
    }

    const file = this.file ?? all[Math.floor(Math.random() * all.length)];
    const mod = await loadBattleModule(file);
    const data = normalizeBattle(mod);
    // Validate with Zod to enforce minimum shape; surface helpful errors.
    const result = BattleSchema.safeParse(data);
    if (!result.success) {
      throw new Error(
        'Invalid Battle data: ' +
          result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join('; '),
      );
    }
    return result.data;
  }
}

// ---- internals ----

type BattleModule = { default?: Partial<Battle> } | Partial<Battle>;

function discoverBattleFiles(): string[] {
  const mods = {
    ...import.meta.glob('/seeds/historical-evidences/battle/*', {
      eager: true,
    }),
    ...import.meta.glob('/src/seeds/historical-evidences/battle/*', {
      eager: true,
    }),
  } as Record<string, unknown>;
  const files: string[] = [];
  for (const abs of Object.keys(mods)) {
    // Normalize to relative from each base
    if (abs.startsWith('/seeds/historical-evidences/battle/')) {
      files.push(abs.replace('/seeds/historical-evidences/battle/', ''));
    } else if (abs.startsWith('/src/seeds/historical-evidences/battle/')) {
      files.push(abs.replace('/src/seeds/historical-evidences/battle/', ''));
    }
  }
  return files.sort();
}

async function loadBattleModule(file: string): Promise<BattleModule> {
  const mods = {
    ...import.meta.glob('/seeds/historical-evidences/battle/*', {
      eager: true,
    }),
    ...import.meta.glob('/src/seeds/historical-evidences/battle/*', {
      eager: true,
    }),
  } as Record<string, unknown>;
  const jsonKey = `/seeds/historical-evidences/battle/${file}`;
  const tsKey = `/src/seeds/historical-evidences/battle/${file}`;
  const mod = (mods[jsonKey] ?? mods[tsKey]) as BattleModule | undefined;
  if (!mod) throw new Error(`Battle not found: ${file}`);
  return mod;
}

function normalizeBattle(mod: BattleModule): Battle {
  const raw: Partial<Battle> = hasDefault(mod)
    ? (mod.default ?? {})
    : (mod as Partial<Battle>);
  const id = raw.id ?? uid('battle');
  const title = raw.title ?? '';
  const subtitle = raw.subtitle ?? '';
  const overview = raw.overview ?? '';
  const scenario = raw.scenario ?? '';
  const komae = normalizeNeta(raw.komae);
  const yono = normalizeNeta(raw.yono);
  const provenance = Array.isArray(raw.provenance) ? raw.provenance : [];
  const status = raw.status ?? 'success';
  return {
    id,
    title,
    subtitle,
    overview,
    scenario,
    komae,
    yono,
    provenance,
    status,
  } satisfies Battle;
}

function normalizeNeta(n?: Partial<Neta> | undefined): Neta {
  const imageUrl = n?.imageUrl ?? 'about:blank';
  const title = n?.title ?? '';
  const subtitle = n?.subtitle ?? '';
  const description = n?.description ?? '';
  const power = typeof n?.power === 'number' ? n.power : 50;
  return { imageUrl, title, subtitle, description, power } satisfies Neta;
}

function hasDefault(x: unknown): x is { default?: Partial<Battle> } {
  return (
    !!x && typeof x === 'object' && 'default' in (x as Record<string, unknown>)
  );
}

// Zod schema for Battle
const NetaSchema = z.object({
  imageUrl: z.string().min(1),
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  power: z.number(),
});

const BattleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string(),
  overview: z.string(),
  scenario: z.string(),
  komae: NetaSchema,
  yono: NetaSchema,
  provenance: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url().optional(),
        note: z.string().optional(),
      }),
    )
    .optional(),
  status: z.enum(['loading', 'success', 'error']).optional(),
});
