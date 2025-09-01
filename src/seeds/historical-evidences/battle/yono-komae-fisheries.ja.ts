import type { Battle } from '@/types/types';

// Yono (Saitama-shi Chuo-ku) vs Komae: fisheries comparison (Japanese)
const battle = {
  id: 'yono-komae-fisheries-2025-ja',
  title: '水産業',
  subtitle: '内陸立地/統計の有無/沿川環境の活用度',
  overview:
    'よの・こまえはいずれも内陸で海に面さない。' +
    '与野は西側を荒川が流れるが、漁業・養殖業は主要産業ではない。' +
    'こまえは多摩川に面するが、大規模な漁業・養殖業は行われていない。' +
    '統計としての水産業データは双方ともに未整備または対象外である。',
  scenario:
    '水辺はレクリエーションや環境教育、親水空間整備、河川生態系の保全といった観点で価値を持つ一方、' +
    '産業としての水産は地域構造から限定的。YONO は荒川近接の親水・防災文脈、' +
    'KOMAE は多摩川沿いの景観・文化資源の活用が主眼となる。',
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'KOMAE の水産業',
    subtitle: '内陸/海なし/多摩川沿い/統計対象外',
    description:
      '地理的には内陸で海に面さない。多摩川に面するが、漁業・養殖業は大規模には展開されていない。' +
      '親水・環境学習・リバーアクティビティ等の非産業的価値が中心。',
    power: 50,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'YONO の水産業',
    subtitle: '内陸/海なし/荒川近接/統計対象外',
    description:
      '地理的には内陸で海に面さない。西側を荒川が流れるが、漁業・養殖業は主要産業ではない。' +
      '水辺利用・防災・環境保全の観点が主となる。',
    power: 50,
  },
  provenance: [
    {
      label: 'KWSK River-Crossing Integration Division',
      note:
        '地理: 双方とも内陸・海なし。水産業の有無: 統計データはなし。' +
        '備考: 与野は荒川近接だが主要産業ではない。こまえは多摩川沿いだが大規模な漁業・養殖は行われていない。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
