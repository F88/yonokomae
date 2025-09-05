import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'ruins-battle',
  themeId: 'history',
  significance: 'medium',
  title: '古代の遺跡を巡る戦い',
  subtitle: 'よの vs. こまえ',
  narrative: {
    overview:
      '与野と狛江、それぞれの地に眠る古代の遺跡が発見された。これは、どちらがより古く、正統な歴史を持つかを証明する、現代の考古学バトルへと発展する。',
    scenario:
      'よのには、縄文時代の貝塚が、こまえには、弥生時代の集落跡が発見された。よのは、貝塚から出土した土器や石器の洗練されたデザインこそが、独自の文化と知性の高さを証明すると主張。一方こまえは、集落跡から発見された水田の痕跡を提示し、定住と協調の精神こそが文明の源流だと反論する。埋もれた歴史の断片を巡り、両者のプライドをかけた戦いが今、始まる。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '集落と定住の精神',
    description:
      '弥生時代の集落跡から、強固なコミュニティを築き上げた歴史を証明する。その協調性は、孤立した環境で生き抜くこまえの精神の原点となっている。',
    power: 30000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '縄文の知恵と文化',
    description:
      '洗練されたデザインを持つ縄文土器の出土は、自然と調和した独自の文化が栄えた証拠。これは、よのの外交戦略に繋がる知性の高さを象徴している。',
    power: 30000,
  },
  provenance: [
    {
      label: '大宮台地',
      note: '多くの縄文時代の遺跡や貝塚が発見されている',
    },
    {
      label: '多摩川沿い',
      note: '弥生時代の集落跡が多数発見されている',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
