import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'ai-oracle',
  themeId: 'information',
  significance: 'high',
  title: 'AIオラクルの予言',
  subtitle: '管理された未来か、自由な運命か',
  narrative: {
    overview:
      'よのは、未来を予言するAI『シンギュラリティ・オラクル』で都市を統治する。しかし、こまえのジャーナリストは、そのAIが市民の自由を奪っていると告発する。真の幸福は、管理された未来か、それとも不確かな自由か。',
    scenario:
      'よの連合国の中枢に設置された巨大なAI『シンギュラリティ・オラクル』は、膨大なデータを分析し、未来に起こりうる災害や経済危機を予測する。よのは、AIの予言に基づいて都市を運営することで、市民に安定した生活をもたらした。しかし、こまえの市民ジャーナリストたちは、AIが都合の悪い情報を検閲していると主張。AIの導きに従うだけの人生に疑問を投げかけ、人々の自由な選択こそが未来を創ると訴える。安定を享受するよのか、不確かな自由を求めるこまえか。AIと人間の、情報と運命を巡る戦いだ。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '反逆のジャーナリスト',
    subtitle: 'AIの予言に抗うペン',
    description:
      'AIの予言に頼らず、人々の生の声と自由な選択こそが真実を創ると主張。AIに支配された未来ではなく、自分たちの手で未来を切り開くことを選ぶ。',
    power: 85,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'シンギュラリティ・オラクル',
    subtitle: '絶対的予言による統治',
    description:
      '膨大なデータと予測能力を持つAI『シンギュラリティ・オラクル』で、市民の生活を安定させる。AIが導き出す完璧な未来こそが、人々の真の幸福だと信じている。',
    power: 85,
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
