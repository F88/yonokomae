import type { HistoricalSeed } from '@yonokomae/types';

export default {
  id: 'tama-river-001-ja',
  title: '多摩川の戦い',
  subtitle: '地域史の転換点',
  overview: '記録と証言に基づく。',
  narrative: '目撃談は河岸付近の激しい衝突を語る。',
  provenance: [
    {
      label: '市史資料: 狛江市',
      url: 'https://example.org/archives/komae/tama-river',
      note: '第3節 目撃者インタビュー',
    },
    { label: '歴史学会誌 1999', note: '第12巻, 45-48頁' },
  ],
} satisfies HistoricalSeed;
