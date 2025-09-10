import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_agile_vs_stable',
  publishState: 'draft',
  themeId: 'information',
  significance: 'low',
  title: '攻めの機動力 vs. 守りの安定感のバトル',
  subtitle: '小回りの利く行政か、盤石な広域行政か',
  narrative: {
    overview:
      '独立を維持した狛江市の機動的な行政運営と、合併で規模のメリットを得たさいたま市(旧与野市)の安定的な行政運営が対決する。',
    scenario:
      '政令指定都市となり、大規模なインフラと広域行政を盤石な「守り」の基盤とするさいたま市。' +
      '多くの市民に安定したサービスを画一的に提供することで、大規模化のメリットを活かしている。' +
      '一方、狛江市は、創業支援事業やDX戦略など、小規模自治体ならではの小回りの利く「攻め」の施策を積極的に推進している。' +
      'これは、既存のサービスを守りつつ、新しい価値を素早く創出することを目指す行政戦略だ。' +
      '果たして、規模の安定性を重視する「守り」の行政と、機動性を活かした「攻め」の行政、どちらが時代の変化に柔軟に対応できるのか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '狛江市の機動的な行政',
    subtitle: '創業支援とDXが支える「攻め」の姿勢',
    description:
      '独立した小規模自治体の強みを活かし、創業支援事業やDX戦略を推進。オンライン申請の導入など、時代に合わせた小回りの利く施策で、市民生活の利便性向上を目指している。',
    power: 82,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'さいたま市の広域安定行政',
    subtitle: '規模のメリットを活かした「守り」の基盤',
    description:
      '政令指定都市という大規模な行政体となり、広域行政を効率的かつ安定的に運営するさいたま市。市民に均一で安定したサービスを提供することで、盤石な行政運営を誇る。',
    power: 86,
  },
  provenance: [
    {
      label: 'さいたま市の広域行政サービスについて',
      url: 'https://www.city.saitama.lg.jp/008/001/p013074.html',
      note: '出典: [11]',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
