import type { Battle, Neta } from '@/types/types';
import type {
  BattleReportRepository,
  JudgementRepository,
  Verdict,
} from '@/yk/repo/core/repositories';
import { applyDelay, type DelayOption } from '../core/delay-utils';
import { loadBattleFromSeeds } from '../core/battle-seed-loader';

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
    // Reuse shared loader: discovers, normalizes, and validates seeds.
    const roots = [
      '/seeds/historical-evidences/battle/',
      '/src/seeds/historical-evidences/battle/',
    ];
    return loadBattleFromSeeds({ roots, file: this.file });
  }
}
// (intentionally empty between loader import and class)

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
   * - Output: 'YONO' | 'KOMAE' | 'DRAW'
   *
   * @param input.battle The battle context containing both neta and power values.
   * @param input.judge The judging entity identity (codeName is used).
   * @param options.signal AbortSignal to cancel the operation.
   * @returns The decided literal winner value.
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
function decideByPower(yono: Neta, komae: Neta): 'YONO' | 'KOMAE' | 'DRAW' {
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
 * @returns Literal winner value after applying rules.
 */
function computeWinnerWithProbAndFallback(
  judgeCode: string,
  r: number,
  yono: Neta,
  komae: Neta,
): 'YONO' | 'KOMAE' | 'DRAW' {
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
