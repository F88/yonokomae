import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'child-safety-battle',
  publishState: 'published',
  themeId: 'technology',
  significance: 'high',
  title: '子どもの安全バトル',
  subtitle: 'AI監視システム vs. 地域見守り活動',
  narrative: {
    overview:
      'よのはAIとドローンで子供の安全を完璧に管理する。しかし、こまえは住民同士の見守り活動こそが真の安全だと主張する。テクノロジーによる完璧な管理か、人の温もりによる見守りか、未来の安全の形が問われる。',
    scenario:
      'よの連合国は、全ての通学路に監視ドローンとAI顔認証システムを配備。' +
      '子供たちの行動はリアルタイムでデータ化され、危険を予測し未然に防ぐ『ガーディアン・システム』が稼働している。' +
      '犯罪発生率はゼロになったが、子供たちは常に監視されている息苦しさを感じている。' +
      '一方、こまえでは、地域の老人会やPTAが中心となった『こまえ見守り隊』が活動。' +
      '挨拶を交わし、時には叱り、子供たちの名前と顔を覚えて日々の成長を見守る。' +
      '非効率的ではあるが、そこには人と人との温かい繋がりがある。' +
      '完璧な安全と引き換えに自由を失うよのか、非効率でも人の温もりを信じるこまえか。' +
      '未来の子供たちを守るのは、どちらのシステムか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ見守り隊',
    subtitle: '人の目と声かけが一番',
    description:
      '地域の老人会やPTAが中心となり、登下校の時間に子供たちに声をかける活動。AIにはできない、人の温もりとコミュニティの絆で子供たちの安全と心を育む。',
    power: 80,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'AIガーディアン・システム',
    subtitle: 'ドローンとAIで危険を予測',
    description:
      '最新のAI顔認証システムと監視ドローンを駆使し、24時間365日子供たちを見守る。犯罪や事故を未然に防ぐ完璧な安全を提供するが、その管理は時に息苦しさも生む。',
    power: 80,
  },
  provenance: [
    {
      label: 'よのセキュリティレポート',
      note: 'AI監視システムにより、子供の犯罪被害はゼロに。ただし、自由な遊びは80%減少。',
    },
    {
      label: 'こまえ見守り隊だより',
      note: 'AIは不審者を見つけられるけど、温かい声かけはできない。',
    },
    {
      label: 'ミライ市長AIレポート',
      note: '地域の見守り活動は、非効率的。人的コストが非常に高い。',
    },
    {
      label: 'こまえの噂話',
      note: 'うちの近所のおじいちゃんは、ドローンより子供たちの顔を覚えている。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
