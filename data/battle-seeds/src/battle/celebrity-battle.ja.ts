import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'celebrity-battle',
  themeId: 'figures',
  significance: 'medium',
  title: '芸能界最強タレント決定戦',
  subtitle: 'よの vs. こまえ',
  narrative: {
    overview:
      '与野が生んだ知のカリスマと、狛江が生んだ孤高の表現者が激突。どちらが人々の心を掴むか、プレイヤーが評価する。',
    scenario:
      'よのは、武井武の系譜を継ぐ安住紳一郎アナウンサーを擁し、その圧倒的な知識と話術で視聴者を魅了。一方こまえは、近藤春菜とおいでやす小田の「ツッコミ」を武器に、どんな強敵にも屈しない孤高の表現者として立ちはだかる。知性か、感情か。笑いか、真面目か。現代を代表するタレントたちが、その存在意義をかけて戦う。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '孤高の表現者',
    description:
      '近藤春菜とおいでやす小田。強固な「ツッコミ」という武器で、どんな相手にも屈しない。彼らのスタイルは、こまえの市民が持つ孤高の精神そのものである。',
    power: 30000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '知のカリスマ',
    description:
      '武井武の系譜を継ぐ安住紳一郎アナウンサー。その優れた話術と冷静な分析力は、よのが誇る知の力そのものだ。',
    power: 30000,
  },
  provenance: [
    {
      label: '近藤春菜 Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E8%BF%91%E8%97%A4%E6%98%A5%E8%8F%9C',
      note: 'こまえ市出身',
    },
    {
      label: 'おいでやす小田 Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E3%81%8A%E3%81%84%E3%81%A7%E3%82%84%E3%81%99%E5%B0%8F%E7%94%B0',
      note: 'こまえ市在住',
    },
    {
      label: '安住紳一郎 Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E5%AE%89%E4%BD%8F%E7%B5%B3%E4%B8%80%E9%83%8E',
      note: 'よの市（現さいたま市中央区）出身',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
