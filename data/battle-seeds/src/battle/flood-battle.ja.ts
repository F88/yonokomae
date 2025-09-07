import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'flood-battle',
  themeId: 'development',
  significance: 'high',
  title: '治水バトル',
  subtitle: '河川の脅威、技術とコミュニティで立ち向かえ',
  narrative: {
    overview:
      '与野が大規模な治水インフラを構築する一方、こまえは過去の災害の教訓から住民の絆を武器に挑む。水害という共通の脅威に対し、異なる戦略が激突する。',
    scenario:
      'よのは、荒川の氾濫を防ぐため、AIによる水門管理システムや巨大な地下放水路を建設。テクノロジーの力で水害を未然に防ごうとする。これは、高度な技術で自然を制御しようとする、よのの誇り高き戦略だ。一方こまえは、多摩川の決壊という過去の悲劇から学び、住民同士の連携と迅速な避難体制を構築。物理的なインフラではなく、強固なコミュニティの力で水害から街を守ろうとする。テクノロジーか、絆か。どちらの戦略が、人々の命を救い、街を守ることができるか、プレイヤーの評価が問われる。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'コミュニティ防災',
    subtitle: '住民の絆で多摩川を守る',
    description:
      '多摩川の決壊を経験した歴史から、住民の相互扶助と迅速な避難体制を最大の武器とする。その結束力は、どんなインフラにも勝る強さである。',
    power: 85,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'テクノロジー防災',
    subtitle: 'AI技術で荒川を制す',
    description:
      'AIによる水門管理や巨大な地下放水路。テクノロジーの力で自然の脅威を制御しようとする。その知の力は、大国と渡り合うよのの誇りそのものである。',
    power: 85,
  },
  provenance: [
    {
      label: '多摩川水害',
      note: '1974年の多摩川堤防決壊に関する歴史的情報',
    },
    {
      label: '荒川氾濫',
      note: '荒川の治水事業に関する情報',
    },
    {
      label: 'こまえ市防災無線',
      note: '「こちらは防災こまえです。隣近所で声を掛け合い、避難を開始してください」という訓練放送の録音。',
    },
    {
      label: 'よの治水AI「リヴァイアサン」開発ログ',
      note: '「予測精度99.8%。しかし、残りの0.2%に何が起こるかは予測不能」というエンジニアのメモ。',
    },
    {
      label: '多摩川緊急治水対策協議会',
      note: '「堤防が切れたら、俺たちが土嚢を積む」という消防団長の発言記録。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
