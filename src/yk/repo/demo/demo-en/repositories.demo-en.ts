import type {
  BattleReportRepository,
  JudgementRepository,
} from '@/yk/repo/core/repositories';
import type { DelayOption } from '@/yk/repo/core/delay-utils';
import {
  DemoBattleReportRepository,
  DemoJudgementRepository,
} from '@/yk/repo/demo/common/repositories.demo-common';
import { enPack } from '@/yk/repo/demo/locales/en';

export class DemoEnBattleReportRepository implements BattleReportRepository {
  private readonly impl: DemoBattleReportRepository;
  constructor(options?: { delay?: DelayOption }) {
    this.impl = new DemoBattleReportRepository(enPack, {
      delay: options?.delay,
    });
  }
  async generateReport(options?: { signal?: AbortSignal }) {
    return this.impl.generateReport(options);
  }
}

export class DemoEnJudgementRepository implements JudgementRepository {
  private readonly impl: DemoJudgementRepository;
  constructor(options?: { delay?: DelayOption }) {
    this.impl = new DemoJudgementRepository({ delay: options?.delay });
  }
  async determineWinner(
    input: Parameters<JudgementRepository['determineWinner']>[0],
    options?: Parameters<JudgementRepository['determineWinner']>[1],
  ) {
    return this.impl.determineWinner(input, options);
  }
}
