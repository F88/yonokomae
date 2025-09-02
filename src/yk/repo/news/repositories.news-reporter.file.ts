import type { BattleReportRepository } from '@/yk/repo/core/repositories';
import type { Battle } from '@/types/types';
import { applyDelay, type DelayOption } from '@/yk/repo/core/delay-utils';
import { loadBattleFromSeeds } from '@/yk/repo/core/battle-seed-loader';

// Seeds under /src/seeds/news/* must export a default Battle object

/**
 * ローカルファイルからニュースを集める BattleReportRepository
 * src/seeds/news/* がデータソース
 */
export class NewsReporterFileiBattleReportRepository
  implements BattleReportRepository
{
  private readonly delay?: DelayOption;
  constructor(opts?: { delay?: DelayOption }) {
    this.delay = opts?.delay;
  }

  async generateReport(options?: { signal?: AbortSignal }): Promise<Battle> {
    await applyDelay(this.delay, options?.signal);
    return loadBattleFromSeeds({
      roots: ['/seeds/news/', '/src/seeds/news/'],
    });
  }
}
