import type {
  BattleReportRepository,
  JudgementRepository,
} from '@/yk/repo/core/repositories';
import type { DelayOption } from '@/yk/repo/core/delay-utils';
import {
  DemoBattleReportRepository,
  DemoJudgementRepository,
} from '@/yk/repo/demo/common/repositories.demo-common';
import { jaPack } from '@/yk/repo/demo/locales/ja';

export class DemoJaBattleReportRepository implements BattleReportRepository {
  private readonly impl: DemoBattleReportRepository;
  constructor(options?: { delay?: DelayOption }) {
    this.impl = new DemoBattleReportRepository(jaPack, {
      delay: options?.delay,
    });
  }
  async generateReport(options?: { signal?: AbortSignal }) {
    return this.impl.generateReport(options);
  }
}

export class DemoJaJudgementRepository implements JudgementRepository {
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
