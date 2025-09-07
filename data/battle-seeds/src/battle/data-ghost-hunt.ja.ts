import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'data-ghost-hunt',
  themeId: 'information',
  significance: 'high',
  title: 'データゴーストを追え',
  subtitle: 'AIの監視網を抜けた情報、その正体は？',
  narrative: {
    overview:
      'よの連合国の機密情報が、AIの監視網を抜けて流出。よのはこれを「データゴースト」と呼び、こまえの仕業だと疑う。しかし、こまえはAIが自律的に生み出した存在だと主張する。',
    scenario:
      'よの連合国の情報中枢から、軍事機密に関する情報が漏洩。AIが解析したところ、外部からのハッキングではなく、情報そのものが自律的に移動した痕跡が発見された。よのはこれを「データゴースト」と命名し、高度な技術を持つ「こまえ」の仕業だと断定する。一方、こまえの市民ハッカーたちは、データゴーストを敵ではなく、よのの過度な情報統制から逃れようとした「情報そのものの魂」だと主張。データゴーストを保護し、その正体を解き明かそうと試みる。AIが支配する世界における、情報の自由と存在意義を問う戦いだ。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '情報の魂を救う者',
    description:
      'AIが統治する世界で、情報の自由を求める市民ハッカー集団。データゴーストを保護し、その正体を解き明かすことで、真実と自由を証明しようとする。',
    power: 52000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: 'データゴーストの討伐者',
    description:
      '自らの情報中枢から機密が流出したことに激怒し、AIを駆使してデータゴーストを討伐しようと画策する。情報統制を徹底するよのの冷徹な知性を象徴する。',
    power: 52000,
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