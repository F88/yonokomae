import type { Battle } from '@yonokomae/types';

// Sample news seed for NewsReporterFileiBattleReportRepository
const data: Battle = {
  id: 'news-sample-local-cuisine-showdown',
  publishState: 'published',
  themeId: 'culture',
  significance: 'low',
  title: 'ご当地グルメ対決',
  subtitle: '地域特産品が料理の覇権を競う',
  narrative: {
    overview: '代表的な料理同士の友好的な競争が地元食文化を紹介',
    scenario:
      '前例のない料理対決において、地域住民によって推薦された代表的な料理が競い合った。料理評論家とコミュニティメンバーが集まり、それぞれの地域を特徴づける独特の味を評価した...',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '狛江料理大使',
    subtitle: '伝統と革新の融合',
    description: '伝統的な地元菓子と川辺の食事文化',
    power: 73,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '与野食品代表',
    subtitle: '季節の味覚',
    description: '歴史ある酒造りの伝統と季節の特産品',
    power: 71,
  },
  provenance: [
    {
      label: '地元食文化調査2024',
      url: 'https://example.com/food-survey',
      note: 'デモンストレーション用の架空の調査です',
    },
  ],
};

export default data;
