import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'ny-vs-paris-ideology',
  themeId: 'economy',
  publishState: 'published',
  significance: 'medium',
  title: '豊かさとは何か?',
  subtitle: 'グローバル資本主義 vs ローカル・コミュニティ主義',
  narrative: {
    overview:
      'アメリカ人投資家は「よの」の経済的ポテンシャルを高く評価。' +
      'しかし、イタリア人シェフは「こまえ」の地域に根ざした食文化に強い魅力を感じる。' +
      'どちらが真の豊かさを体現しているのかを問うバトル。',
    scenario:
      'よのは、資本の流動性、国際取引、ユニコーン創出のエコシステム、効率的なインフラが生む成長ポテンシャルを提示。' +
      '一方、こまえは、季節の市場、顔の見える生産者、食の継承と地域循環がつくる暮らしの豊かさを主張。' +
      'グローバル資本が牽引するスケールの力か、コミュニティが紡ぐ小さな循環の力か。プレイヤーの指標が価値を決める。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'ローカル・テロワール',
    subtitle: '地域に根ざす食と暮らし',
    description:
      '朝市の香り、' +
      '生産者の顔、' +
      '受け継がれるレシピ。' +
      '小さな経済圏が生む安心と風味は、' +
      '時間をかけて熟成される豊かさ。',
    power: 86,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'グローバル・キャピタル',
    subtitle: '資本が拓く成長と機会',
    description:
      '多様な投資、' +
      '厚い資本市場、' +
      '俊敏なイノベーション。' +
      '規模の経済とネットワーク効果で、' +
      '新しい価値を次々に社会実装する。',
    power: 86,
  },
  provenance: [
    {
      label: 'ゲーム内設定',
      note: '架空のシナリオ',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
