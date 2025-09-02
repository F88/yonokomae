import { uid } from '@/lib/id';
import type { Battle, Neta } from '@/types/types';
import type {
  BattleReportRepository,
  JudgementRepository,
  Winner,
  Verdict,
} from '@/yk/repo/core/repositories';
import { z } from 'zod';
import { applyDelay, type DelayOption } from '../core/delay-utils';

/**
 * BattleReportRepository that loads battle data from historical evidence seeds.
 *
 * It discovers seed files under `seeds/historical-evidences/battle/` or
 * `src/seeds/historical-evidences/battle/`, loads one (optionally specified),
 * normalizes its shape, validates via zod, and returns a Battle.
 */
export class HistoricalEvidencesBattleReportRepository
  implements BattleReportRepository
{
  private readonly file?: string;
  private readonly delay?: DelayOption;

  /**
   * @param opts Optional configuration
   * @param opts.file Optional seed file name to load (e.g. `001.json`).
   *                  When omitted, a random file will be chosen.
   * @param opts.delay Optional artificial delay configuration for UX simulation.
   */
  constructor(opts?: { file?: string; delay?: DelayOption }) {
    this.file = opts?.file;
    this.delay = opts?.delay;
  }

  /**
   * Generates a battle by loading and validating a seed file.
   *
   * @param options.signal AbortSignal to cancel the operation.
   * @returns A validated Battle object derived from a seed.
   * @throws Error when no battle files are found or when validation fails.
   */
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

type BattleModule = { default?: Partial<Battle> } | Partial<Battle>;

/**
 * Discover available battle seed files from supported locations.
 *
 * @returns Sorted list of file names (without the absolute prefix paths).
 */
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
    if (abs.startsWith('/seeds/historical-evidences/battle/')) {
      files.push(abs.replace('/seeds/historical-evidences/battle/', ''));
    } else if (abs.startsWith('/src/seeds/historical-evidences/battle/')) {
      files.push(abs.replace('/src/seeds/historical-evidences/battle/', ''));
    }
  }
  return files.sort();
}

/**
 * Loads the esm module for a given seed file name.
 *
 * @param file File name relative to the battle seeds folder.
 * @returns The loaded module shape.
 * @throws Error when the module cannot be found.
 */
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

/**
 * Normalizes possibly-partial battle seed data into a complete Battle shape.
 *
 * - Fills defaults for missing fields.
 * - Ensures `id` is present (generated when missing).
 *
 * @param mod Loaded module export.
 * @returns A Battle value (not yet validated by zod schema).
 */
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

/**
 * Normalizes a partial Neta to a fully-populated value.
 *
 * @param n Partial Neta value from seed.
 * @returns Neta with defaults for any missing fields.
 */
function normalizeNeta(n?: Partial<Neta> | undefined): Neta {
  const imageUrl = n?.imageUrl ?? 'about:blank';
  const title = n?.title ?? '';
  const subtitle = n?.subtitle ?? '';
  const description = n?.description ?? '';
  const power = typeof n?.power === 'number' ? n.power : 50;
  return { imageUrl, title, subtitle, description, power } satisfies Neta;
}

/**
 * Type guard for modules exporting a default battle.
 */
function hasDefault(x: unknown): x is { default?: Partial<Battle> } {
  return (
    !!x && typeof x === 'object' && 'default' in (x as Record<string, unknown>)
  );
}

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

// (intentionally empty between schemas and class)

/**
 * JudgementRepository for historical research mode.
 *
 * The decision is based on judge-specific probabilities with a deterministic
 * fallback to power comparison for the remaining probability mass.
 *
 * Probability policy by judge code:
 * - O, U: 20% -> YONO; otherwise fallback to power
 * - S, C: 20% -> KOMAE; otherwise fallback to power
 * - KK: 90% -> KOMAE; otherwise fallback to power
 * - unknown: fallback to power
 *
 * Use the injected RNG to allow deterministic unit tests.
 */
export class HistoricalEvidencesJudgementRepository
  implements JudgementRepository
{
  private readonly delay?: DelayOption;
  private readonly rng: () => number;
  /**
   * @param options Optional configuration
   * @param options.delay Artificial delay for UX simulation.
   * @param options.rng Random number generator returning [0, 1). Defaults to Math.random.
   */
  constructor(options?: { delay?: DelayOption; rng?: () => number }) {
    this.delay = options?.delay;
    this.rng = options?.rng ?? Math.random;
  }

  /**
   * Determines winner using per-judge probability, then falls back to power.
   *
   * Contract:
   * - Inputs: Battle (yono, komae) and Judge (id, name, codeName)
   * - Output: Winner string literal: 'YONO' | 'KOMAE' | 'DRAW'
   *
   * @param input.battle The battle context containing both neta and power values.
   * @param input.judge The judging entity identity (codeName is used).
   * @param options.signal AbortSignal to cancel the operation.
   * @returns The decided Winner.
   */
  async determineWinner(
    input: {
      battle: Battle;
      judge: { id: string; name: string; codeName: string };
    },
    options?: { signal?: AbortSignal },
  ): Promise<Verdict> {
    await applyDelay(this.delay, options?.signal);
    const r = this.rng();
    const winner = computeWinnerWithProbAndFallback(
      input.judge.codeName,
      r,
      input.battle.yono,
      input.battle.komae,
    );
    const code = (input.judge.codeName ?? '').trim().toUpperCase();
    const powerDiff = input.battle.yono.power - input.battle.komae.power;
    const reason: Verdict['reason'] =
      (code === 'O' || code === 'U') && r < 0.2
        ? 'bias-hit'
        : (code === 'S' || code === 'C') && r < 0.2
          ? 'bias-hit'
          : code === 'KK' && r < 0.9
            ? 'bias-hit'
            : 'power';
    return { winner, reason, rng: r, judgeCode: code, powerDiff };
  }
}

/**
 * Fallback decision: simple power comparison.
 *
 * @param yono YONO side neta
 * @param komae KOMAE side neta
 * @returns 'YONO' when yono.power > komae.power, 'KOMAE' when less, otherwise 'DRAW'.
 */
function decideByPower(yono: Neta, komae: Neta): Winner {
  if (yono.power > komae.power) return 'YONO';
  if (yono.power < komae.power) return 'KOMAE';
  return 'DRAW';
}

/**
 * Computes the winner using a judge-specific probability and power fallback.
 *
 * Rules:
 * - O, U: 20% -> YONO; else -> decideByPower
 * - S, C: 20% -> KOMAE; else -> decideByPower
 * - KK: 90% -> KOMAE; else -> decideByPower
 * - default: decideByPower
 *
 * @param judgeCode Code name of the judge (case-insensitive; trimmed).
 * @param r Random number in [0, 1) from RNG injection.
 * @param yono YONO neta
 * @param komae KOMAE neta
 * @returns Winner after applying probability and fallback rules.
 */
function computeWinnerWithProbAndFallback(
  judgeCode: string,
  r: number,
  yono: Neta,
  komae: Neta,
): Winner {
  const code = (judgeCode ?? '').trim().toUpperCase();
  switch (code) {
    case 'O':
      return r < 0.2 ? 'YONO' : decideByPower(yono, komae);
    case 'U':
      return r < 0.2 ? 'YONO' : decideByPower(yono, komae);
    case 'S':
      return r < 0.2 ? 'KOMAE' : decideByPower(yono, komae);
    case 'C':
      return r < 0.2 ? 'KOMAE' : decideByPower(yono, komae);
    case 'KK':
      return r < 0.9 ? 'KOMAE' : decideByPower(yono, komae);
    default:
      return decideByPower(yono, komae);
  }
}
