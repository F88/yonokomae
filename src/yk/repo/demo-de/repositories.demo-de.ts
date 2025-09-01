import type {
  BattleReportRepository,
  JudgementRepository,
  Winner,
  PlayMode,
} from '@/yk/repo/core/repositories';
import type { Battle } from '@/types/types';
import { uid } from '@/lib/id';
import { applyDelay, type DelayOption } from '../core/delay-utils';

/**
 * DemoDeBattleReportRepository
 *
 * Language-specific demo repository for the 'demo-de' play mode.
 *
 * - Returns German (Deutsch) demo battle data: titles, subtitles, narrative.
 * - All strings produced by this repository are in German.
 * - Inspired by English seeds but localized to DE; no special markers embedded.
 * - Separated to allow divergence without affecting other modes.
 */
export class DemoDeBattleReportRepository implements BattleReportRepository {
  private delay?: DelayOption;

  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }

  async generateReport(options?: { signal?: AbortSignal }): Promise<Battle> {
    await applyDelay(this.delay, options?.signal);
    const patterns: Battle[] = [
      {
        id: 'template-de-1',
        title: 'Brückengefecht bei Dämmerung',
        subtitle: 'Gleichgewicht als Pflichtfach',
        overview:
          'Kleine Rangelei an der alten Brücke, aus Dorfnotizen destilliert.',
        scenario:
          'Dämmerung, schmale Bretter und heldenhafte Gleichgewichtstests.',
        yono: {
          imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
          title: 'Brückenschutz — Nachtwache, Abschnitt Ostpfeiler',
          subtitle:
            'Fester Stand, kühler Kopf und eine Liste knarrender Bohlen',
          description:
            'Fußnoten streiten, die Brücke bleibt stoisch. Sieger: der nächste Muskelkater. Laternenlicht und Formblätter als heimliche Helden. Die Bücher tragen Matschsignaturen, Stiefel verfassen Randbemerkungen, und der Quartiermeister kritisiert die Lyrisierung des Inventars.',
          power: 56,
        },
        komae: {
          imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
          title: 'Aufklärungstrupp — Schräganlauf an den Brückenkopf',
          subtitle:
            'Blicke nach vorn, Schritte kaum hörbar, Karten leicht feucht vom Nebel',
          description:
            'Fußnoten streiten, die Brücke bleibt stoisch. Sieger: der nächste Muskelkater. Kreidespuren riechen ein wenig nach Fluss. Späher berichten am Rande von flinken Fröschen, und die Logistik empfiehlt künftig pfadfinderischere, weniger poetische Routen.',
          power: 54,
        },
      },
      {
        id: 'template-de-2',
        title: 'Laternen-Aufklärung',
        subtitle: 'Stimmung gewinnt die Initiative',
        overview:
          'Laternen locken Motten, Gerüchte und mindestens einen General an.',
        scenario:
          'Sanftes Leuchten, noch sanftere Taktik: die Atmosphäre übernimmt.',
        yono: {
          imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
          title: 'Aufklärungstrupp — Vordere Elemente auf schmalen Brettern',
          subtitle:
            'Karten in der Tasche, Schatten im Dienst, Stiefel im Dialog mit Schlamm',
          description:
            'Strategie flüstert, Ambiente gewinnt per Seufzer-Mehrheit. Fürs Protokoll: wärmere Socken beantragt. Eine Fußnote schlägt Laternenetikette für Motten vor, während die Moralabteilung Richtlinien für panoramische Umwege entwirft.',
          power: 62,
        },
        komae: {
          imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
          title: 'Fernmeldekompanie — Laternen-Verbindungsdetachement',
          subtitle:
            'Fahnen, Fackeln und präzises Timing, Laternenpolitur optional',
          description:
            'Strategie flüstert, Ambiente gewinnt per Seufzer-Mehrheit. Boten wünschen einen Dimmer für den Mondschein. Das Protokoll vermerkt blendungsbedingte Tapferkeit und einen Antrag auf sternenkompatible Interpunktion.',
          power: 58,
        },
      },
      {
        id: 'template-de-3',
        title: 'Teekannen-Pattsituation',
        subtitle: 'Dampf, Banner und Fehlinterpreten',
        overview:
          'Dampf, Banner und semaphorische Missverständnisse in Reih und Glied.',
        scenario:
          'Kazoos heben die Moral; Taktik wird zur Interpretationskunst.',
        yono: {
          imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
          title: 'Fernmeldekompanie — Semaphor-Zug, Kessel in Dienststellung',
          subtitle: 'Semaphor durch Dampf, Choreografie vom Kessel abgesegnet',
          description:
            'Verwirrung befördert sich selbst – mit Stil und Teearoma. Unsichtbare Tauben spenden höflichen Applaus. Der Kessel beansprucht in einer Fußnote Seniorität, und die Fahnen schließen sich kurzzeitig zur Aushandlung der Teepausen zusammen.',
          power: 48,
        },
        komae: {
          imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
          title: 'Brückenschutz — Holzprüfkommando',
          subtitle:
            'Balken geprüft, Gemüter beruhigt, Teetemperatur diskutiert',
          description:
            'Verwirrung befördert sich selbst – mit Stil und Teearoma. Protokollnotiz: „dampfig, aber geordnet“. Nachtrag empfiehlt Untersetzer für die Moral, mit Schlussvermerk: „genehmigt, jedoch feucht“.',
          power: 55,
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
 * DemoDeJudgementRepository
 *
 * Language-specific demo repository for the 'demo-de' play mode.
 *
 * - Returns judgement aligned with German-localized demo content.
 * - All outputs are language-agnostic enums, but this repo belongs to DE mode.
 * - Kept separate to allow independent evolution from other modes.
 */
export class DemoDeJudgementRepository implements JudgementRepository {
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
