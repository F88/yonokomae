import type { BattleReportRepository } from './repositories';
import type { Battle } from '@/types/types';
import { applyDelay, type DelayOption } from './delay-utils';

/**
 * MultiSourceBattleReportRepository
 *
 * A wrapper repository that selects one of two underlying data sources
 * ("local" or "api") each time generateReport is called.
 *
 * Notes:
 * - Selection uses an injected RNG (default: Math.random) and a weight for API.
 * - Only one underlying repository is invoked per call.
 * - No network is required if the provided "api" repo is a local simulator.
 */
export class MultiSourceBattleReportRepository
  implements BattleReportRepository
{
  private readonly local: BattleReportRepository;
  private readonly api: BattleReportRepository;
  private readonly weightApi: number;
  private readonly rng: () => number;
  private readonly delay?: DelayOption;

  constructor(opts: {
    local: BattleReportRepository;
    api: BattleReportRepository;
    /** Probability of choosing API repository (0..1). Default: 0.5 */
    weightApi?: number;
    /** RNG for selection. Default: Math.random */
    rng?: () => number;
    /** Optional artificial delay for UX simulation */
    delay?: DelayOption;
  }) {
    this.local = opts.local;
    this.api = opts.api;
    const w = typeof opts.weightApi === 'number' ? opts.weightApi : 0.5;
    this.weightApi = w < 0 ? 0 : w > 1 ? 1 : w;
    this.rng = opts.rng ?? Math.random;
    this.delay = opts.delay;
  }

  async generateReport(options?: { signal?: AbortSignal }): Promise<Battle> {
    await applyDelay(this.delay, options?.signal);
    const r = this.rng();
    const useApi = r < this.weightApi;
    const chosen = useApi ? this.api : this.local;
    return chosen.generateReport(options);
  }
}
