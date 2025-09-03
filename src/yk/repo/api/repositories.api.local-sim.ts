import type { BattleReportRepository } from '@/yk/repo/core/repositories';
import type { Battle } from '@/types/types';
import { applyDelay, type DelayOption } from '@/yk/repo/core/delay-utils';
import { BattleReportRandomDataRepository } from '@/yk/repo/random-jokes/repositories.random-jokes';

/**
 * LocalApiBattleReportRepository
 *
 * An API-shaped repository that does NOT perform network I/O.
 * It delegates to a local data source (seed/random) and can be
 * used where an API repository would be selected, but the app
 * must run fully static (e.g., on GitHub Pages).
 */
export class LocalApiBattleReportRepository implements BattleReportRepository {
  private readonly delay?: DelayOption;
  private readonly local: BattleReportRandomDataRepository;
  constructor(opts?: { delay?: DelayOption }) {
    this.delay = opts?.delay;
    this.local = new BattleReportRandomDataRepository({ delay: this.delay });
  }
  async generateReport(options?: { signal?: AbortSignal }): Promise<Battle> {
    await applyDelay(this.delay, options?.signal);
    // Delegate to local generator; could also map shapes if API differs.
    return this.local.generateReport(options);
  }
}
