import type { Battle } from '@yonokomae/types';

// Sample news seed #2
const newsSample2: Battle = {
  id: 'battle-news-2',
  title: '夕方のアップデート: コミュニティのハイライト',
  subtitle: 'イベント、プロジェクト、フィードバック',
  overview:
    '両市でコミュニティ主導の取り組みが主役となり、着実な進捗と高い参加が報告されています。',
  scenario:
    '狛江では都市ガーデニングの週末ワークショップが始まり、満席の盛況。与野はオープンデータのダッシュボード試作版を公開し、開発者と住民に参加を呼びかけています。協働が共通のテーマとして浮かび上がりました。',
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '与野',
    subtitle: 'オープンデータ',
    description: 'ダッシュボード試作版を公開',
    power: 50,
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '狛江',
    subtitle: '都市ガーデニング',
    description: '週末ワークショップが満席',
    power: 50,
  },
  provenance: [
    {
      label: 'Community Forum Digest',
      url: 'https://example.com/community/digest',
    },
    { label: 'Civic Tech Notes', url: 'https://example.com/civic-tech/notes' },
  ],
  status: 'success',
};

export default newsSample2;
