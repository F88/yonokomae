import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'hamburger-war-1',
  publishState: 'published',
  themeId: 'community',
  significance: 'medium',
  title: 'ハンバーガーチェーン戦争',
  subtitle: 'よののフランチャイズ vs. こまえの手作りバーガー',
  narrative: {
    overview:
      'よのは世界中に店舗を持つ巨大チェーンを誘致。こまえは、昔ながらの商店街で手作りの味を守る店を応援する。どちらが市民の胃袋と心を掴むかを競う。このバトルは、アメリカ出身でアメリカンジョーク好きのコミュニティメンバーによって作成された。',
    scenario:
      'よのは、合併による巨大な経済圏を背景に、世界的なハンバーガーチェーンを招致し、市民に画一的で効率的な味を提供する。一方、こまえは、多摩川の恵みを受けた地元産の野菜を使い、おばあちゃんのレシピを受け継いだ手作りハンバーガー店を応援。規模と効率を追求するよのか、伝統と温かさを大切にするこまえか。どちらが市民の心を掴むか、プレイヤーの評価が問われる。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえバーガー',
    subtitle: 'おばあちゃんの味を守る',
    description:
      '地元の農家が作った新鮮な野菜を使い、代々受け継がれた秘伝のレシピで作られる手作りバーガー。その味は、こまえの市民が持つ温かい絆の象徴である。',
    power: 77,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よのバーガー',
    subtitle: '世界を席巻するフランチャイズ',
    description:
      ' よの連合に本社を構える世界規模のハンバーガーチェーン。AIによる完璧な品質管理と、効率的なサービスで、よのの市民に安定した美味しさを提供する。',
    power: 88,
  },
  provenance: [
    {
      label: '多摩川のカワウソ通信',
      note: 'こまえバーガーのパティは、川で釣った魚で作られているってウソだよ！',
    },
    {
      label: 'よのバーガーのクーポン',
      note: '巨大バーガーを食べて、宇宙旅行へ行こう！',
    },
    {
      label: 'こまえ市民の声',
      note: '「よののバーガーは大きくて美味しいけど、ちょっと冷たいのよね」',
    },
    {
      label: 'コミュニティ由来',
      note: 'アメリカ出身でアメリカンジョーク好きのメンバーが作成',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
