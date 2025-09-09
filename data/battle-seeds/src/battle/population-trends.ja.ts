import type { Battle } from '@yonokomae/types';

// Yono vs Komae: population trends (Japanese version)
const battle = {
  id: 'population-trends-1920-2050-ja',
  publishState: 'published',
  themeId: 'development',
  significance: 'high',
  title: '人口動向',
  subtitle: '国勢調査スナップショットと将来推計(1920-2050)',
  narrative: {
    overview:
      '1920から2050(推計含む)までのYONOとKOMAEの人口スナップショットにより、長期的な軌跡の相違を示す。',
    scenario:
      'YONOは1920の10,750から2050推計の104,000まで増加し、1945(19,000)、1970(71,000)、1980(81,000)、2000(97,000)、2020(103,000)と段階的に拡大。KOMAEは1920の5,595から1980の70,000まで上昇し、2020は約82,000で安定、その後2050には45,000へと減少推計。これらは都市化、インフラ、地域的役割の違いを映す。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'KOMAEの人口',
    subtitle: '上昇、横ばい、将来の減少',
    description:
      '主なポイント: 1920 5,595; 1970 50,000; 1980 70,000; 2000 78,000; 2020 82,000; 2050 45,000(推計)。1970の市制施行に重なる急増。長期推計では顕著な減少。',
    power: 52,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'YONOの人口',
    subtitle: '1世紀を通じた着実な成長',
    description:
      '主なポイント: 1920 10,750; 1945 19,000; 1970 71,000; 1980 81,000; 2000 97,000; 2020 103,000; 2050 104,000(推計)。戦後加速を経て約10万人で安定化。',
    power: 58,
  },
  provenance: [
    {
      label: 'Arakawa Crossing Council, Komae HQ',
      note: 'YONO・KOMAEの1920、1945、1970、1980、2000、2020、2050(推計)の人口値。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
