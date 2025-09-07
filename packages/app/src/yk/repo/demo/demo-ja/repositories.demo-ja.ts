import type {
  BattleReportRepository,
  JudgementRepository,
  GenerateBattleReportParams,
} from '@/yk/repo/core/repositories';
import type { Battle } from '@yonokomae/types';
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
  async generateReport(params?: GenerateBattleReportParams): Promise<Battle> {
    return this.impl.generateReport(params);
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
