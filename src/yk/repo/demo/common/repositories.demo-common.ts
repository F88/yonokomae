import type {
  BattleReportRepository,
  JudgementRepository,
  Verdict,
} from '@/yk/repo/core/repositories';
import type { Battle } from '@yonokomae/types';
import { uid } from '@/lib/id';
import { applyDelay, type DelayOption } from '@/yk/repo/core/delay-utils';

export type DemoBattlePattern = {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  scenario: string;
  yono: Battle['yono'];
  komae: Battle['komae'];
};

export type DemoLocalePack = {
  patterns: DemoBattlePattern[];
};

export class DemoBattleReportRepository implements BattleReportRepository {
  private delay?: DelayOption;
  private readonly pack: DemoLocalePack;

  constructor(pack: DemoLocalePack, options?: { delay?: DelayOption }) {
    this.pack = pack;
    this.delay = options?.delay;
  }

  async generateReport(options?: { signal?: AbortSignal }): Promise<Battle> {
    await applyDelay(this.delay, options?.signal);
    const patterns = this.pack.patterns;
    const pick = patterns[Math.floor(Math.random() * patterns.length)];
    return {
      id: uid('battle'),
      title: pick.title,
      subtitle: pick.subtitle,
      overview: pick.overview,
      scenario: pick.scenario,
      yono: pick.yono,
      komae: pick.komae,
      status: 'success',
    };
  }
}

export class DemoJudgementRepository implements JudgementRepository {
  private delay?: DelayOption;

  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }

  async determineWinner(
    input: {
      battle: Battle;
      judge: { id: string; name: string; codeName: string };
    },
    options?: { signal?: AbortSignal },
  ): Promise<Verdict> {
    await applyDelay(this.delay, options?.signal);
    const { yono, komae } = input.battle;
    const powerDiff = yono.power - komae.power;
    const winner: 'YONO' | 'KOMAE' | 'DRAW' =
      powerDiff === 0 ? 'DRAW' : powerDiff > 0 ? 'YONO' : 'KOMAE';
    return { winner, reason: 'power', powerDiff };
  }
}
