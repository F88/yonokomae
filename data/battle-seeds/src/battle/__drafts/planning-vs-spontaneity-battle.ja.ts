import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_planning_vs_spontaneity',
  publishState: 'draft',
  themeId: 'development',
  significance: 'legendary',
  title: '計画された都市 vs. 自然な発展のバトル',
  subtitle: '開発主導のまちづくりか、市民参加の熟成か',
  narrative: {
    overview:
      '埼玉新都心という計画的な開発を主導した旧与野市と、市民参加型のイベントや自然を活かしたまちづくりを重視する狛江市。都市の発展に対する思想が対決する。',
    scenario:
      '与野市は、大宮市・浦和市との合併において、埼玉新都心という大規模開発を推進。' +
      'これは、行政が主導し、巨大な都市インフラを計画的に構築することで、都市の将来を切り開くという思想だ。' +
      '一方、狛江市は「水と緑のまち」という将来像を掲げ、多摩川を中心とした市民参加型のイベントや、地域ボランティアによるまちづくりを重視している。' +
      'これは、計画的な開発よりも、市民の自発的な活動や自然の力を活かし、都市を自然に熟成させていくという思想だ。' +
      '果たして、トップダウンの壮大な計画と、ボトムアップの自然な成長、どちらがより市民にとって幸福な都市を生み出すのか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '市民参加型のまちづくり',
    subtitle: '多摩川いかだレースが象徴するボトムアップの力',
    description:
      '多摩川いかだレースや花火大会など、市民が主体となって開催されるイベントが盛んな狛江市。これは、行政主導の計画的な開発に頼らず、市民の力でまちを熟成させていくことを重視する姿勢を象徴している。',
    power: 84,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '埼玉新都心の計画開発',
    subtitle: '行政が主導するトップダウンの都市計画',
    description:
      '合併を決定づけた要因の一つである埼玉新都心開発。これは、巨大な行政機関や商業施設を計画的に配置することで、都市のあり方を一変させる、トップダウン型の都市計画を象徴している。',
    power: 89,
  },
  provenance: [
    {
      label: '狛江市のまちづくりと自然について',
      url: 'https://www.city.komae.tokyo.jp/index.cfm/46,134979,c,html/134979/20240904-170340.pdf',
      note: '出典: [18]',
    },
    {
      label: '埼玉新都心と合併の経緯について',
      url: 'http://gyosei.mine.utsunomiya-u.ac.jp/yoka01/takeia/Takeia010523.htm',
      note: '出典: ',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
