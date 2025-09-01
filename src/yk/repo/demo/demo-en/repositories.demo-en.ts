import type {
  BattleReportRepository,
  JudgementRepository,
  Winner,
  PlayMode,
} from '@/yk/repo/core/repositories';
import type { Battle } from '@/types/types';
import { uid } from '@/lib/id';
import { applyDelay, type DelayOption } from '../../core/delay-utils';

/**
 * DemoEnBattleReportRepository
 *
 * Language-specific demo repository for the 'demo-en' play mode.
 *
 * - Returns English-only demo battle data (title, subtitle, narrative).
 * - Seeds are inspired by English scenario seeds under
 *   `src/seeds/random-data/scenario/*.en.ts`.
 * - Kept separate to allow divergence without affecting other demo modes.
 *
 * @remarks
 * This repository intentionally produces witty, clearly humorous content
 * for demonstration. All strings are in English by design.
 */
export class DemoEnBattleReportRepository implements BattleReportRepository {
  private delay?: DelayOption;

  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }

  async generateReport(options?: { signal?: AbortSignal }): Promise<Battle> {
    await applyDelay(this.delay, options?.signal);
    // Three hard-coded Battle objects; pick is Battle-typed
    const patterns: Battle[] = [
      {
        id: 'template-en-1',
        title: 'Bridge Skirmish at Dusk',
        subtitle: 'Balance Checks on Narrow Planks',
        overview:
          'Brief but pivotal clash near an old bridge, compiled from local notes.',
        scenario:
          'Dusk falls at the old bridge. Footing is narrow, morale runs high.',
        yono: {
          imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
          title: 'Bridge Guard — Night Watch Detail',
          subtitle:
            'Steady posts, steady nerves, and a ledger of squeaky boards',
          description:
            'Footnotes argue, the bridge stays unimpressed. Winner: sore calves tomorrow. Patrol notes insist it was heroic paperwork under dim lanterns. Logs cite meticulous ledger entries, boots annotate margins with mud, and the quartermaster files a complaint about romanticizing inventory.',
          power: 58,
        },
        komae: {
          imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
          title: 'Recon Platoon — Bridge Approaches Sweep',
          subtitle: 'Eyes forward, boots quiet, maps damp but determined',
          description:
            'Footnotes argue, the bridge stays unimpressed. Winner: sore calves tomorrow. Perimeter chalk notes smell faintly of river water. Scouts add a sidebar about elusive frogs, and logistics recommend less poetic routes in future annexes.',
          power: 52,
        },
      },
      {
        id: 'template-en-2',
        title: 'Lantern Reconnaissance',
        subtitle: 'Ambience Wins the Initiative',
        overview:
          'Lanterns illuminate the field and attract unexpected attention.',
        scenario:
          'Recon lines shimmer under warm lantern light; strategy adapts on sight.',
        yono: {
          imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
          title: 'Recon Platoon — Forward Elements on Narrow Planks',
          subtitle:
            'Maps in pockets, shadows on call, boots learning diplomacy with mud',
          description:
            'Strategy whispers; ambience wins by unanimous sigh. Retreat reason: vibes. Field scribes request warmer socks next time. A marginal note proposes lantern etiquette for moths, while morale officers draft a memo on scenic detours.',
          power: 61,
        },
        komae: {
          imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
          title: 'Signal Company — Lantern Liaison Detachment',
          subtitle:
            'Flags, flares, and faultless timing, lantern polish optional',
          description:
            'Strategy whispers; ambience wins by unanimous sigh. Retreat reason: vibes. Dispatch riders request a dimmer switch for the moon. Minutes also note glare-induced heroism and a formal petition for star-compatible punctuation.',
          power: 59,
        },
      },
      {
        id: 'template-en-3',
        title: 'Teapot Stand-off',
        subtitle: 'Steam, Banners, and Mixed Signals',
        overview:
          'Steam and banners muddle the lines; morale turns theatrical.',
        scenario:
          'Whistles, flags, and a steady kettle—signal misreads reshape tempo.',
        yono: {
          imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
          title: 'Signal Company — Semaphore Section, Kettle Adjacent',
          subtitle:
            'Semaphores over steam, choreography approved by the kettle',
          description:
            'Confusion promotes itself with style and a hint of tannin. With applause from unseen pigeons. The kettle claims seniority in a footnote, and the flags unionize briefly to negotiate tea breaks.',
          power: 47,
        },
        komae: {
          imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
          title: 'Bridge Guard — Timber Inspection Crew',
          subtitle: 'Timbers checked, tempers cooled, tea temperature debated',
          description:
            'Confusion promotes itself with style and a hint of tannin. Minutes filed under “steamy but orderly.” Addendum recommends coasters for morale, and a final stamp reads: “approved, albeit damp.”',
          power: 54,
        },
      },
    ];
    const pick: Battle = patterns[Math.floor(Math.random() * patterns.length)];

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

/**
 * DemoEnJudgementRepository
 *
 * Language-specific demo repository for the 'demo-en' play mode.
 *
 * - Returns judgement outputs aligned to English demo data.
 * - Kept separate to allow divergence without affecting other modes.
 *
 * @remarks
 * This repository belongs to 'demo-en' and expects English data.
 */
export class DemoEnJudgementRepository implements JudgementRepository {
  private delay?: DelayOption;

  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }

  async determineWinner(
    input: { battle: Battle; mode: PlayMode; extra?: Record<string, unknown> },
    options?: { signal?: AbortSignal },
  ): Promise<Winner> {
    await applyDelay(this.delay, options?.signal);
    const { yono, komae } = input.battle;
    if (yono.power === komae.power) return 'DRAW';
    return yono.power > komae.power ? 'YONO' : 'KOMAE';
  }
}
