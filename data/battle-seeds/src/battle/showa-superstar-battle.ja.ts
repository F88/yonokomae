import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'showa-superstar-battle',
  themeId: 'figures',
  significance: 'medium',
  title: '昭和の大スター対決',
  subtitle: 'よの vs. こまえ',
  narrative: {
    overview:
      '時代を築いた昭和の大スターたちが、それぞれの故郷の誇りをかけて激突する。歌声と演技、そしてカリスマ性で、どちらが勝利を掴むか。',
    scenario:
      'よのは、伝説の歌手・郷ひろみを擁し、その華麗なパフォーマンスと圧倒的な歌声で観客を魅了する。一方、こまえは、不世出の女優・紺野美沙子を代表とし、朗読や知性的な魅力で静かに人々を惹きつける。華やかさで勝るよのか、深みと知性で勝るこまえか。世代を超えた伝説のスターたちが、故郷の名誉をかけて戦う。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '深みと知性の表現者',
    description:
      '紺野美沙子。朗読や国際協力活動で知られ、こまえの文化的な側面を体現する。彼女の持つ知的な魅力は、こまえの市民が誇る精神の豊かさそのものである。',
    power: 40000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '華麗なるエンターテイナー',
    description:
      '郷ひろみ。その圧倒的な存在感とパフォーマンスは、よのの持つ華やかさと時代を切り開く力を象徴している。新都心のライトに最も似合う男、それが彼の正体だ。',
    power: 40000,
  },
  provenance: [
    {
      label: '郷ひろみ Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E9%83%B7%E3%81%B2%E3%82%8D%E3%81%BF',
      note: 'よの市（現さいたま市中央区）出身',
    },
    {
      label: '紺野美沙子 Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E7%B4%BA%E9%87%8E%E7%BE%8E%E6%B2%99%E5%AD%90',
      note: 'こまえ市在住',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
