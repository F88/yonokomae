import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_urban_model',
  publishState: 'draft',
  themeId: 'development',
  significance: 'high',
  title: '脱東京 vs. 東京の近隣のバトル',
  subtitle: '地方中核都市か、質の高いベッドタウンか',
  narrative: {
    overview:
      '県内最大規模の都市となり、「脱東京」の中核都市を目指すさいたま市(旧与野市)と、東京の利便性を享受しつつ独自の個性を磨く狛江市。' +
      '目指すべき都市モデルをめぐり対決する。',
    scenario:
      '与野市が合併して誕生したさいたま市は、交通と経済の要衝として「脱東京」的な都市圏を形成。' +
      'これは、地方が自立した拠点都市として成長し、東京一極集中に対抗する道だ。' +
      '一方、狛江市は東京都に属し、都心から電車で約20分という利便性を強みとし、多摩川の自然と調和した独自の生活圏を築いている。' +
      'これは、大都市の機能を最大限に活用しつつ、質の高い郊外生活を追求するモデルだ。' +
      '果たして、都市としての自立性を目指す「脱東京」モデルと、大都市圏の良質な「近隣」として特化するモデル、どちらが住民の幸福をより高めることができるのか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '東京の近隣都市モデル',
    subtitle: '都心への利便性と豊かな自然を両立',
    description:
      '東京都区部に隣接し、都心から約20分という立地を活かしたベッドタウン。' +
      '多摩川の自然を守りつつ、市民参加型のイベントが盛んな、独自の生活圏を築いている。',
    power: 86,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '地方中核都市モデル',
    subtitle: '合併で生まれた首都圏北部の拠点',
    description:
      '合併により誕生したさいたま市は、交通の要衝であり、政治・経済・文化の中心として、東京圏から自立した中核都市を目指す。' +
      'これは、地方創生で語られる理想的な地方都市の姿を体現する。',
    power: 90,
  },
  provenance: [
    {
      label: '狛江市の都市概要と立地について',
      url: 'https://www.sumai1.com/useful/townranking/town_13219/',
      note: '出典: [15]',
    },
    {
      label: 'さいたま市の都市概況と歴史について',
      url: 'https://zzfo.zhengzhou.gov.cn/yhcs/2342739.jhtml',
      note: '出典: [13]',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
