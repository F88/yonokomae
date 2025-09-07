import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'taste-algorithm',
  themeId: 'culture',
  significance: 'medium',
  title: '味のアルゴリズム',
  subtitle: 'AIシェフの究極レシピか、おふくろの味か',
  narrative: {
    overview:
      'よのは、AIが創り出す究極の料理で市民を魅了する。一方こまえは、代々受け継がれた家庭料理で対抗。食文化を巡る、テクノロジーと伝統の戦いだ。',
    scenario:
      'よの連合国は、市民の健康と満足度を最大化するAIシェフ『ガストロノミー・オラクル』を開発。膨大なレシピデータと味覚データを解析し、完璧な栄養バランスと美味しさを兼ね備えた料理を市民に提供する。これにより、食の安全と豊かさが約束された。しかし、こまえの市民は、この完璧すぎる料理に異を唱える。彼らは、多摩川の恵みや、畑で採れたての野菜を使い、代々受け継がれてきた家庭料理こそが、真の文化だと主張。AIが計算した完璧な味か、不完全だが温かい手作りの味か。どちらが人々の心を満たし、食文化の未来を創るか、プレイヤーの評価が問われる。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '家庭の味の守り人',
    description:
      'AIに頼らず、家族で受け継がれてきた伝統的なレシピを守る。不完全だが、温かい手作りの味は、こまえの市民が誇る最大の文化である。',
    power: 45,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: 'AIシェフの究極レシピ',
    description:
      '膨大なデータを学習したAIが完璧な栄養バランスと美味しさを両立させた究極の料理を創造。その完璧さは、よのが誇る知性とテクノロジーの結晶である。',
    power: 45,
  },
  provenance: [
    {
      label: 'よのフード・イノベーション',
      note: 'AIが導き出した、栄養バランス最高の完璧な食事。',
    },
    {
      label: 'こまえ市民からの情報提供',
      note: '「よのの料理は美味しいけど、食べ終わるとちょっと寂しい気持ちになる」',
    },
    {
      label: '食文化研究家のブログ',
      note: '「AIは再現できない。料理の味とは、作り手の想いと時間のことだ」と語る。',
    },
    {
      label: 'こまえのおばあちゃんのレシピ帳',
      note: '多摩川で採れた素材を使った、昔ながらの「カワウソ汁」のレシピが記されている。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;