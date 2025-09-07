import type {
  BattleReportRepository,
  JudgementRepository,
  Verdict,
  GenerateBattleReportParams,
} from '@/yk/repo/core/repositories';
import type { Battle } from '@yonokomae/types';
import { uid } from '@/lib/id';
import { applyDelay, type DelayOption } from '@/yk/repo/core/delay-utils';

export type DemoBattlePattern = {
  id: string;
  themeId: Battle['themeId'];
  significance: Battle['significance'];
  title: string;
  subtitle: string;
  overview: string; // kept in pack, mapped to narrative
  scenario: string; // kept in pack, mapped to narrative
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

  async generateReport(arg?: GenerateBattleReportParams): Promise<Battle> {
    const signal = arg?.signal;
    const filter = arg?.filter;
    await applyDelay(this.delay, signal);
    let patterns = this.pack.patterns;
    const themeId = filter?.battle?.themeId;
    const idFilter = filter?.battle?.id;
    const significance = filter?.battle?.significance;
    if (themeId) patterns = patterns.filter((p) => p.themeId === themeId);
    if (idFilter) patterns = patterns.filter((p) => p.id === idFilter);
    if (significance)
      patterns = patterns.filter((p) => p.significance === significance);
    if (patterns.length === 0) {
      // Fallback empty battle (ensures type soundness under strict + noUncheckedIndexedAccess)
      return {
        id: uid('battle'),
        themeId: 'history',
        significance: 'low',
        title: 'No Patterns Available',
        subtitle: '',
        narrative: { overview: '', scenario: '' },
        yono: {
          imageUrl: 'about:blank',
          title: '',
          subtitle: '',
          description: '',
          power: 50,
        },
        komae: {
          imageUrl: 'about:blank',
          title: '',
          subtitle: '',
          description: '',
          power: 50,
        },
        status: 'success',
        provenance: [],
      } satisfies Battle;
    }
    const pickIndex = Math.floor(Math.random() * patterns.length);
    const pick = patterns[pickIndex];
    if (!pick) {
      // Should not happen, but keep defensive
      return {
        id: uid('battle'),
        themeId: 'history',
        significance: 'low',
        title: 'Pattern Load Error',
        subtitle: '',
        narrative: { overview: '', scenario: '' },
        yono: {
          imageUrl: 'about:blank',
          title: '',
          subtitle: '',
          description: '',
          power: 50,
        },
        komae: {
          imageUrl: 'about:blank',
          title: '',
          subtitle: '',
          description: '',
          power: 50,
        },
        status: 'error',
        provenance: [],
      } satisfies Battle;
    }
    return {
      id: uid('battle'),
      themeId: pick.themeId,
      significance: pick.significance,
      title: pick.title,
      subtitle: pick.subtitle,
      narrative: { overview: pick.overview, scenario: pick.scenario },
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
