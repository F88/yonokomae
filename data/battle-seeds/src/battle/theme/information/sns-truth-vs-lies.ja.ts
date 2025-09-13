import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'sns-truth-vs-lies',
  themeId: 'information',
  publishState: 'published',
  significance: 'high',
  title: 'SNSの真実と嘘',
  subtitle: 'AIによる情報精査か、市民の生の声か',
  narrative: {
    overview:
      'よののAIは、市民の混乱を防ぐため情報を統制。' +
      '一方こまえの市民は、SNSで真実を追求し、命を救う。' +
      '情報が最大の武器となる現代の戦いだ。',
    scenario:
      '巨大な災害が発生した際、よのはAIによる情報精査を行い、パニックを防ぐために一部の情報を統制する決断を下す。' +
      'この統制により、市民は冷静さを保ち、都市の機能は維持された。' +
      'しかし、その裏で犠牲になった人々の情報も隠蔽されていた。' +
      '対するこまえでは、市民たちがSNSを駆使してリアルタイムに被害状況を発信。' +
      '正確ではない情報も混じるが、その生の声は救助活動に繋がり、多くの命を救った。' +
      '管理された真実か、混沌とした真実か。' +
      'どちらの情報が、人々の生命と希望を守るか、プレイヤーの評価が問われる。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '市民の声',
    subtitle: 'SNSで紡がれる混沌の真実',
    description:
      'SNSを駆使したリアルタイムの情報発信で、災害時のコミュニティを支える。' +
      '混沌の中でも真実を求める市民の熱意は、こまえの誇りである。',
    power: 90,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'AIの判断',
    subtitle: '統制された秩序ある真実',
    description:
      'AIによる情報精査と統制で、市民のパニックを防ぎ都市の安定を優先する。' +
      'その合理的で冷徹な判断は、多くの命を救う一方で、隠された犠牲を生み出す。',
    power: 90,
  },
  provenance: [
    {
      label: 'ゲーム内設定',
      note: '架空のシナリオ',
    },
    {
      label: 'こまえ市民のX(旧Twitter)投稿',
      note: '「#狛江水没なう #助けて」という投稿が、救助隊を動かした記録。',
    },
    {
      label: 'よの市危機管理AI「オーディン」のログ',
      note: '「市民のパニック指数が閾値を超過。情報統制レベル3を発動」という記録。',
    },
    {
      label: '国際ジャーナリストのレポート',
      note: '「よのは都市を守り、こまえは人を守った。どちらが正しかったのか」と締めくくられている。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
