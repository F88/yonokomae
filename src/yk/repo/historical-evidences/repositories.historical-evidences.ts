import { uid } from '@/lib/id';
import type { Battle, Neta } from '@/types/types';
import type {
  BattleReportRepository,
  JudgementRepository,
  PlayMode,
  Winner,
} from '@/yk/repo/core/repositories';
import { z } from 'zod';
import { applyDelay, type DelayOption } from '../core/delay-utils';

/**
 * HistoricalEvidencesBattleReportRepository
 *
 * **Purpose**: Historical evidence repository for loading complete, curated battle data files.
 *
 * **Data Source**:
 * - **Uses dedicated evidence files**: Loads from `/seeds/historical-evidences/battle/` directory
 * - Supports both JSON and TypeScript battle files (.json, .ts)
 * - Each file contains complete Battle objects with full historical context
 * - More comprehensive than seed-system scenarios (complete battles vs. scenario templates)
 *
 * **File Discovery**:
 * - Automatically discovers battle files at build time via Vite glob imports
 * - Searches in both `/seeds/historical-evidences/battle/` and `/src/seeds/historical-evidences/battle/`
 * - Each file exports a Battle-compatible object as default export
 *
 * **Features**:
 * - Complete battle data loading (not generation)
 * - Rich historical documentation with full battle context
 * - Supports file-specific loading or random selection
 * - Higher fidelity historical content than scenario-based generation
 * - Ready-to-use Battle objects with all fields populated
 * - Zod validation for battle data integrity
 *
 * **Use Cases**:
 * - 'historical-evidences' PlayMode - Authentic historical battles
 * - Educational content with verified historical accuracy
 * - Museum/archive integration scenarios
 * - High-quality content showcasing
 *
 * **File Format**:
 * ```typescript
 * // battle-name.ts
 * export default {
 *   id: "historical-battle-001",
 *   title: "Battle Title",
 *   // ... complete Battle object
 * } satisfies Battle;
 * ```
 *
 * **Dependencies**: Vite glob imports, Zod validation
 *
 * @see {@link BattleReportRepository} for interface definition
 * @see Battle type for complete battle data structure
 */
export class HistoricalEvidencesBattleReportRepository
  implements BattleReportRepository
{
  private readonly file?: string;
  private readonly delay?: DelayOption;

  constructor(opts?: { file?: string; delay?: DelayOption }) {
    this.file = opts?.file;
    this.delay = opts?.delay;
  }

  async generateReport(options?: { signal?: AbortSignal }): Promise<Battle> {
    await applyDelay(this.delay, options?.signal);
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

/**
 * HistoricalEvidencesJudgementRepository
 *
 * Dedicated judging strategy for the `historical-research` mode.
 *
 * Current rule set:
 * - Uses deterministic power comparison identical to demo/fake repos
 * - Tie results in 'DRAW'
 * - Includes artificial delay via applyDelay for UX consistency
 *
 * Rationale:
 * - Keeps behaviour stable with existing tests while isolating future
 *   historical heuristics (e.g., provenance weighting, scenario modifiers)
 */
export class HistoricalEvidencesJudgementRepository
  implements JudgementRepository
{
  private readonly delay?: DelayOption;
  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }

  async determineWinner(
    input: { battle: Battle; mode: PlayMode; extra?: Record<string, unknown> },
    options?: { signal?: AbortSignal },
  ): Promise<Winner> {
    await applyDelay(this.delay, options?.signal);
    const { yono, komae } = input.battle;
    if (yono.power === komae.power) return 'DRAW';
    return yono.power > komae.power ? 'YONO' : 'KOMAE';
  }
}
