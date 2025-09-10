import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'family-bonds-vs-state-protection',
  publishState: 'draft',
  themeId: 'community',
  significance: 'medium',
  title: 'だれが守る? 家族か国家か',
  subtitle: '近所の手 vs 24hインフラ',
  narrative: {
    overview:
      'ブラジル人家族は「こまえ」の住民同士の強い絆に感動。' +
      '一方、スウェーデン人公務員は「よの」の充実した公共サービスと安全な街づくりを高く評価。' +
      'どちらの社会がより安心して暮らせるかを問うバトル。',
    scenario:
      'こまえは、近所同士の助け合い、世代を超えた見守り、コミュニティの温かさを武器にする。困った時には自然と手が伸びる「顔見知り」のネットワークがある。' +
      '一方、よのは、整備された福祉制度、24時間の安全インフラ、誰もが同じ水準で守られる仕組みを推進。' +
      '情のネットか、制度のセーフティネットか。プレイヤーの価値観が試される。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'コミュニティ・ファミリー',
    subtitle: '助け合いは最強のセーフティ',
    description:
      'ご近所の目配り、温かい声かけ、世代で継ぐ支え合い。顔の見えるつながりが毎日の安心を作る。制度に頼らずとも、誰かがそばにいる。',
    power: 82,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'パブリック・プロテクション',
    subtitle: '制度で守る公平な安心',
    description:
      '福祉、医療、教育、防犯まで、切れ目なくつながる公共サービス。ルールとデータに支えられた安全で、公平な保護が行き渡る。',
    power: 82,
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
