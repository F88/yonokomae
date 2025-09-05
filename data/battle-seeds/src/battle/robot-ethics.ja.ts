import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'robot-ethics',
  themeId: 'technology',
  significance: 'high',
  title: 'ロボット倫理の境界線',
  subtitle: '軍事技術の転用か、人間の仕事の喪失か',
  narrative: {
    overview:
      'こまえが生み出した戦闘ロボット『武者』を、よのは災害救助に転用しようと提案。一方こまえの市民は、自分たちの仕事を奪われると反発する。技術と倫理の境界線が問われるバトルだ。',
    scenario:
      'こまえが誇る戦闘ロボット『武者』は、災害現場での瓦礫撤去など、危険な作業で絶大な効果を発揮する。この技術に目をつけたよのは、『武者』を軍事目的だけでなく、公共事業に活用するよう提案。これにより、都市の復興が飛躍的に進むと主張する。しかし、この計画はこまえの市民に大きな動揺をもたらした。彼らは『武者』が自分たちの仕事を奪い、コミュニティの絆を壊すのではないかと懸念する。技術は人の生活を豊かにするものか、それとも脅かすものか。二つの小国が、ロボットという存在を通して、人類の未来を問う。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '人々の絆を守る者',
    description:
      '自らの手で街を築き、人々の絆を守ることを何よりも大切にする。戦闘ロボット『武者』を平和的に活用したいという願いを持つ一方、それが市民の仕事を奪うことへの懸念も抱く。',
    power: 55000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '知恵と効率を追求する者',
    description:
      '高度な知性とテクノロジーを持つよのは、戦闘ロボット『武者』の公共事業への転用を提案。技術を最大限に活用し、都市の効率化と市民の安全を確保しようと試みる。',
    power: 55000,
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