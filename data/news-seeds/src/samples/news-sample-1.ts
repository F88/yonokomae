import type { Battle } from '@yonokomae/types';

// Sample news seed for NewsReporterFileiBattleReportRepository
const data: Battle = {
  id: 'battle-news-1',
  themeId: 'information',
  publishState: 'published',
  significance: 'low',
  title: '朝のブリーフ: 与野 vs 狛江',
  subtitle: 'ローカルアップデートに注目',
  narrative: {
    overview: '与野と狛江で注目の動きを手短にまとめました。',
    scenario:
      '本日の速報では、与野が行政サービスの効率化に向けたパイロットを開始。一方、狛江は緑地と地域イベントに注力しています。市民からは実利と近隣への良い影響を評価する声が上がっています。',
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '与野',
    subtitle: '行政サービス効率化',
    description: '行政サービスのパイロット開始',
    power: 50,
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '狛江',
    subtitle: '緑地とイベント',
    description: '地域イベントと緑地整備に注力',
    power: 50,
  },
  provenance: [
    {
      label: 'Yono City - Newsroom',
      url: 'https://example.com/yono/news',
    },
    {
      label: 'Komae City - Announcements',
      url: 'https://example.com/komae/announcements',
    },
  ],
  status: 'success',
};
export default data;
