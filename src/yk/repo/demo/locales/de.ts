import type { DemoLocalePack } from '@/yk/repo/demo/common/repositories.demo-common';

export const dePack: DemoLocalePack = {
  patterns: [
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
        subtitle: 'Fester Stand, kühler Kopf und eine Liste knarrender Bohlen',
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
      scenario: 'Kazoos heben die Moral; Taktik wird zur Interpretationskunst.',
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
        subtitle: 'Balken geprüft, Gemüter beruhigt, Teetemperatur diskutiert',
        description:
          'Verwirrung befördert sich selbst – mit Stil und Teearoma. Protokollnotiz: “dampfig, aber geordnet”. Nachtrag empfiehlt Untersetzer für die Moral, mit Schlussvermerk: “genehmigt, jedoch feucht”.',
        power: 55,
      },
    },
  ],
};
