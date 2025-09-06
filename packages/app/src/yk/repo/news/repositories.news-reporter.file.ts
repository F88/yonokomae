import type { BattleReportRepository } from '@/yk/repo/core/repositories';
import type { Battle } from '@yonokomae/types';
import { applyDelay, type DelayOption } from '@/yk/repo/core/delay-utils';
import { newsSeeds } from '@yonokomae/data-news-seeds';

// Static imports from @yonokomae/data-news-seeds package

/**
 * ローカルファイルからニュースを集める BattleReportRepository
 * @yonokomae/data-news-seeds パッケージがデータソース
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
    // Select a random news seed from static imports
    const randomIndex = Math.floor(Math.random() * newsSeeds.length);
    const selectedSeed = newsSeeds[randomIndex];
    if (!selectedSeed) {
      throw new Error('No news seeds available');
    }
    return selectedSeed;
  }
}
