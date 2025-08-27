import type { HistoricalSeed } from '@/yk/repo/seed-system';

const seedJa = {
  id: 'bridge-skirmish-002-ja',
  title: '古橋の小競り合い',
  subtitle: '短期だが転機の衝突',
  overview: '地域ニュースと日記から編集。',
  narrative: '黄昏の橋のたもとで突如の対立が起きた。',
  provenance: [
    {
      label: '町のニュースレター (2003)',
      note: '第7号 目撃者コラム',
    },
    {
      label: 'プレースホルダー画像',
      url: 'https://placehold.co/',
      note: '一時的な挿絵アセット',
    },
  ],
} satisfies HistoricalSeed;

export default seedJa;
