import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'underground-conspiracy',
  themeId: 'development',
  significance: 'high',
  title: '地下水脈の密航者',
  subtitle: '二つの地下計画が交差する時、真の陰謀が姿を現す',
  narrative: {
    overview:
      'よのは荒川の地下に、こまえは多摩川の地下に、それぞれ秘密の経路を画策。それは互いの未来を賭けた、壮大な陰謀の始まりだった。',
    scenario:
      'TOKIO連合への依存を脱却するため、こまえは多摩川を越えて隣国KKと通ずる秘密の地下鉄の建設を計画。これは、こまえの市民開発者たちが持つ高度な地下掘削技術によって可能となった。一方、よのは、TOKIO連合の内部情報を得るため、荒川の地下水脈を利用した秘密の地下経路を構築しようと画策する。これは、武力ではない知の力で大国に対抗する、よのの外交戦略そのものである。両者の地下計画が交差する時、それは単なる都市開発ではなく、関東の地政学を一変させるほどの壮大な陰謀であることが明らかになる。テクノロジーか、絆か。未来の都市の設計図を賭けた戦いが始まる。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: 'KWSKとの密約',
    description:
      '多摩川を越え、隣国KKと通ずる地下鉄を建設し、TOKIO連合からの独立と、KWSKとの関係深化を狙う。その計画は、市民が持つ高度な技術と、コミュニティの結束力によって支えられている。',
    power: 55000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: 'TOKIOへの密航者',
    description:
      '荒川の地下水脈に秘密の通路を構築し、TOKIO連合への密行を画策。これは、武力ではない知の力で大国に対抗する、よのの外交戦略そのものである。AIを駆使したハッキングで、こまえの地下計画の情報も狙っている。',
    power: 55000,
  },
  provenance: [
    {
      label: 'ゲーム内設定',
      note: '架空のシナリオ',
    },
    {
      label: 'こまえ地下鉄計画の設計図',
      note: '「最終目的地：KWSK中央駅」と書かれたメモが添付されている。',
    },
    {
      label: 'よのハッカー部隊「チーム・サイタマ」の活動記録',
      note: 'こまえの計画をハッキングしようと試みたが、強固なセキュリティに阻まれたとの報告。',
    },
    {
      label: 'TOKIO連合諜報部の報告書',
      note: '「よのとこまえ、両者の地下での動きを警戒せよ」との警告が発せられている。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
