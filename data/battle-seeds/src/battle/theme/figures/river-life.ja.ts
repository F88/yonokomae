import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'river-life',
  themeId: 'figures',
  publishState: 'published',
  significance: 'medium',
  title: '川のなかからこんにちは',
  subtitle: '川の主が語る、都市の本当の姿',
  narrative: {
    overview:
      '多摩川に住むカワウソがこまえの街を批評し、荒川に住むウナギがよのの街を批評する。人間には見えない視点から語られる、都市の真実とは？',
    scenario:
      '「こまえの街は、川辺がにぎやかで落ち着かないな」と、多摩川に住むカワウソ。しかし、その賑わいの中にも、自然を大切にする人々の温かさを感じている。一方、「よのの街は、川が整備されすぎていて住みにくいな」と、荒川に住むウナギ。しかし、その整備された川には、水質を管理するAIロボットがいて、とても清潔で安全だと感じている。どちらの批評がより核心を突いているか?',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '多摩川に住むカワウソの批評',
    description:
      'こまえは、多摩川の恵みを享受しているが、川辺の賑わいで少し落ち着かない。しかし、川の自然を大切にする人々の温かさに触れ、居心地の良さも感じている。',
    power: 30,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '荒川に住むウナギの批評',
    description:
      'よのは、荒川を整備し、清潔さを保っている。しかし、自然のままの川で暮らしたいウナギにとっては、少し物足りない。AIが管理する清潔な川に、何を感じるのか。',
    power: 30,
  },
  provenance: [
    {
      label: '多摩川魚類の回想録',
      note: '「よのの川はきれいだが、隣のやつと話すことがない」との記述。',
    },
    {
      label: '荒川AI報告書',
      note: '「水質は完璧。しかし、感情指数は測定不能」という分析結果。',
    },
    {
      label: '多摩川の古老漁師の記録',
      note: '「魚は、少しの濁りがあった方が、美味いんだ」と記されている。',
    },
    {
      label: 'よの環境学会の論文',
      note: '「荒川の生態系は、シミュレーションモデルとして完璧である」と発表。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
