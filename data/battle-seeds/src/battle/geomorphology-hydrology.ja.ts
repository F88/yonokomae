import type { Battle } from '@yonokomae/types';

// Yono (Saitama-shi Chuo-ku) vs Komae: geomorphology and hydrology comparison (Japanese)
const battle = {
  id: 'geomorphology-hydrology-2025-ja',
  publishState: 'published',
  themeId: 'development',
  significance: 'medium',
  title: '地形と水系',
  subtitle: '台地・低地・主要河川のプロファイル比較',
  narrative: {
    overview:
      'よの(現よの連合国よのの主要部)は大宮台地の南部に位置し、全体に緩やかな平坦地が広がる。' +
      '市域を横断する大河川は少ないが、西側を荒川が流れ、広域の水系を支える。一方、こまえは武蔵野台地の南端で、' +
      '南部に多摩川がつくる低地、北側に台地が広がる。標高は概ね 10〜20m で、南部を多摩川が東西に流下し、堤防整備が進む。',
    scenario:
      '地形と水系は都市の景観・防災・移動性・土地利用に直結する。YONO は台地性・平坦性が高く、' +
      '街路の接続性や自転車移動のしやすさ、面的更新の計画余地に寄与しうる。KOMAE は多摩川低地と台地のコントラストが強く、' +
      '河川景観や親水空間、防災(堤防・内水対策)と一体のまちづくりが重要となる。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'KOMAE の地形・水系',
    subtitle: '武蔵野台地の南端/多摩川低地/標高 10〜20m',
    description:
      '市の南部を多摩川が東西に流れる。南の低地と北の台地から成り、河川景観が市の歴史・日常と深く結びつく。' +
      '洪水対策として堤防整備が進み、親水空間の活用や避難動線の計画が課題と機会を同時に生む。',
    power: 51,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'YONO の地形・水系',
    subtitle: '大宮台地南部/全体になだらかな平坦地/西側に荒川',
    description:
      '旧中山道沿いに市街が形成され、台地性の平坦な地形が面的な更新や歩行・自転車の回遊に適する。' +
      '市域を流れる大きな河川は少ないが、西側を荒川が貫流し、流域圏のインフラ・生態系の基盤となる。',
    power: 51,
  },
  provenance: [
    {
      label: 'KWSK River-Crossing Integration Division',
      note:
        'よの(よの)は大宮台地南部の平坦地/旧中山道沿いに市街。大きな河川は少ないが西側を荒川が流れる。' +
        'こまえは武蔵野台地南端で、多摩川低地と北側台地から成る。標高 10〜20m。南部を多摩川が東西に流れ、堤防整備。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
