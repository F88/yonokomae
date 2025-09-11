import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'ancient-life-battle',
  publishState: 'published',
  themeId: 'history',
  significance: 'low',
  title: '縄文・弥生生活様式の対決',
  subtitle: '狩りか、農耕か。古代の生存戦略',
  narrative: {
    overview:
      '縄文時代と弥生時代、それぞれの生活様式を代表する二つの文化が激突。狩猟採集か、それとも農耕か。どちらがより優れた文明を築き、現代のよの・こまえの精神の源流となったか。',
    scenario:
      'よのは、縄文時代の狩猟採集生活を起源に持つと主張。' +
      '自然と調和し、狩りや漁で食料を得るその生活様式は、柔軟で即応性の高いよのの知性の根源だ。' +
      '一方、こまえは弥生時代の農耕文化を源流と主張。' +
      '米作りを通じて定住生活を築き、強固なコミュニティを形成した。' +
      'その団結力と粘り強さは、こまえの孤高の精神に繋がっている。' +
      'どちらの文化が、現代の二国を形作ったか、プレイヤーは歴史の原点に立ち返り評価する。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '弥生の民',
    subtitle: '強固な共同体を築いた弥生人',
    description:
      '米作りを通じて定住生活を確立。外来の文化を取り入れつつ、強固なコミュニティを築き上げた弥生人の末裔である。',
    power: 50,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '縄文の民',
    subtitle: '自然と調和した縄文人',
    description:
      '自然の恵みを享受し、狩猟採集で生きた縄文人の末裔。その柔軟な知性は、時代の変化に適応するよのの外交戦略の原点である。',
    power: 50,
  },
  provenance: [
    {
      label: '縄文時代',
      note: '狩猟採集生活を主とした時代',
    },
    {
      label: '弥生時代',
      note: '稲作を基盤とした農耕社会が形成された時代',
    },
    {
      label: 'よの市立博物館',
      note: '「縄文人の知恵」特別展の展示記録。',
    },
    {
      label: 'こまえ郷土資料館',
      note: '「弥生の米作りと村のくらし」の解説パネル。',
    },
    {
      label: '多摩川の古老の言い伝え',
      note: '「川の恵みは米作りに、山の恵みは狩りに」という古い歌が残っている。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
