import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_space_philosophy',
  publishState: 'draft',
  themeId: 'development',
  significance: 'legendary',
  title: '都市の熟成 vs. 都市の刷新のバトル',
  subtitle: '既存の自然と共生か、大規模開発による変革か',
  narrative: {
    overview:
      'さいたま新都心という大規模開発で都市空間を刷新した旧与野市と、多摩川や畑など既存の自然と共生する道を選んだ狛江市。' +
      '都市計画の思想が激突する。',
    scenario:
      '与野市は、さいたま新都心の開発という巨大プロジェクトを通じて、都市の風景を大きく刷新した。' +
      'これは、人工的なインフラと新しい建物を大規模に創造することで、都市の活力を高めることを目指す、未来志向の思想を象徴している。' +
      '一方、狛江市は、多摩川や畑など既存の自然を大切にし、それらを活用した地域ブランドを形成している。' +
      'これは、都市の熟成を重視し、自然と調和した持続可能なまちづくりを追求する思想だ。' +
      '果たして、人工的な力で未来を築く哲学と、既存の自然を活かす哲学、どちらがより豊かな都市空間を生み出すのか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '多摩川との共生',
    subtitle: '水と緑の街が育む持続可能な空間',
    description:
      '多摩川を都市の核として捉え、豊かな自然景観を維持しつつ、市民が参加できるイベントを多数開催。' +
      '既存の自然を最大限に活かし、都市の熟成を重視するまちづくりを体現している。',
    power: 80,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'さいたま新都心の変革',
    subtitle: '大規模開発による都市の刷新',
    description:
      '合併の動機の一つとなったさいたま新都心は、多くの官庁や商業施設が集積し、都市の風景を一変させた。' +
      'これは、大規模開発によって都市を刷新し、新たな価値を創造する思想を象徴している。',
    power: 85,
  },
  provenance: [
    {
      label: '狛江市のまちづくりと自然について',
      url: 'https://www.city.komae.tokyo.jp/index.cfm/46,134979,c,html/134979/20240904-170340.pdf',
      note: '出典: [17, 18]',
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
