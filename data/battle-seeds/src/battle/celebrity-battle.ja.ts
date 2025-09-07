import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'celebrity-battle',
  themeId: 'figures',
  significance: 'medium',
  title: '芸能界最強タレント決定戦',
  subtitle: '守護神か、ツッコミか。笑いと勝利の行方',
  narrative: {
    overview:
      'よのが生んだ知の守護神と、こまえが誇る孤高の表現者が激突。どちらが人々の心を掴むか、プレイヤーが評価する。',
    scenario:
      'よのは、武井武の系譜を継ぐ知の守護神、川島永嗣を擁し、その冷静な判断力と卓越した反射神経でゴールを守る。一方こまえは、近藤春菜の「ツッコミ」を武器に、どんな強敵にも屈しない孤高の表現者として立ちはだかる。守りか、攻めか。真剣な眼差しを持つ守護神か、ユーモアで人々を魅了する表現者か。現代を代表する二つの才能が、その存在意義をかけて戦う。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '孤高の表現者',
    description:
      '近藤春菜。こまえ市出身のお笑い芸人。強固な「ツッコミ」という武器で、どんな相手にも屈しない。彼女のスタイルは、こまえの市民が持つ孤高の精神そのものである。',
    power: 30000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '知の守護神',
    description:
      '川島永嗣。よの市（現さいたま市中央区）出身のサッカー選手。その優れた知性と冷静な判断力は、よのが誇る知の力そのものだ。彼の守備は、よのの外交戦略そのものを体現している。',
    power: 30000,
  },
  provenance: [
    {
      label: '近藤春菜 Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E8%BF%91%E8%97%A4%E6%98%A5%E8%8F%9C',
      note: 'こまえ市出身',
    },
    {
      label: '川島永嗣 Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E5%B7%9D%E5%B3%B6%E6%B0%B8%E5%97%8C',
      note: 'よの市（現さいたま市中央区）出身',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
