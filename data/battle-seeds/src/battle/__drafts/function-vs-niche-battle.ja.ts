import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_function_vs_niche',
  publishState: 'draft',
  themeId: 'development',
  significance: 'medium',
  title: '統合された都市機能 vs. 特化した専門都市のバトル',
  subtitle: '巨大なハブ機能か、独自のニッチな強みか',
  narrative: {
    overview:
      '合併により巨大な都市機能を統合したさいたま市(旧与野市)と、' +
      '独立を維持し、' +
      '特定の分野で独自の強みを磨く狛江市が、' +
      '都市としての価値をかけて対決する。',
    scenario:
      '与野市、浦和市、大宮市の合併により、さいたま市は「さいたま新都心」という巨大な交通・行政ハブ機能を持つ大都市へと変貌した。' +
      'これは、大規模なインフラと都市機能を統合し、首都圏の北の玄関口としての役割を担うことを目指す、機能集約型の都市戦略だ。' +
      '一方、狛江市は「音楽の街」や「枝豆」といった、特定の分野に特化したブランドを追求し、独自のニッチな強みで都市の個性を際立たせている。' +
      'これは、小規模であることの強みを最大限に活かした専門化戦略だ。' +
      '果たして、広域都市が持つ統合の力が、専門都市が持つ独自の個性と魅力を上回るのか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '狛江の専門化戦略',
    subtitle: '音楽と農業が都市の個性を創り出す',
    description:
      '「音楽の街」や「狛江ブランド農産物」など、特定の分野に特化した都市ブランドを追求し、独自の強みを確立する狛江市の戦略。' +
      '小規模ならではのきめ細やかな地域振興が強み。',
    power: 84,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'さいたま新都心',
    subtitle: '交通と行政の巨大なハブ機能',
    description:
      '旧与野市に位置するさいたま新都心は、国の機関や巨大な商業施設が集まる、さいたま市の中心的なハブ機能を持つ。' +
      'これは、合併による都市機能の統合とスケールメリットを象徴する。',
    power: 92,
  },
  provenance: [
    {
      label: '狛江市の地域ブランドについて',
      url: 'https://www.city.komae.tokyo.jp/index.cfm/45,125767,347,2090,html',
      note: '出典: ',
    },
    {
      label: 'さいたま新都心と合併の経緯について',
      url: 'http://gyosei.mine.utsunomiya-u.ac.jp/yoka01/takeia/Takeia010523.htm',
      note: '出典: ',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
