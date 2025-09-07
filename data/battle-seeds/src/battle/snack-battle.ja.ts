import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'snack-battle',
  themeId: 'culture',
  significance: 'low',
  title: 'おかしでせかいをまもろう',
  subtitle: 'よのの宇宙ゼリー vs. こまえの土星チョコ',
  narrative: {
    overview:
      'よのとこまえに、とってもおいしいヒミツのお菓子があったんだ！どっちのお菓子が一番おいしくて、みんなを笑顔にできるか、よーいドン！',
    scenario:
      'よののひみつのお菓子は、キラキラした星がたくさん入った「宇宙ゼリー」。食べると頭がよくなって、ロケットを飛ばせるんだって！一方こまえのひみつのお菓子は、多摩川の石みたいな「土星チョコ」。食べると体が強くなって、どんな高いところにも登れちゃう！「うちのお菓子の方がすごいんだぞー！」って、お菓子をめぐって、よのとこまえが本気で勝負するんだ！',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '土星チョコ',
    subtitle: '土星チョコ',
    description:
      '多摩川の石みたいなかたちをした、とってもおいしいチョコレート。食べると体がムキムキになって、高い木にも登れちゃうよ。みんなで分けて食べると、もっと仲良しになれる魔法のお菓子。',
    power: 12000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '宇宙ゼリー',
    subtitle: '宇宙ゼリー',
    description:
      '星がキラキラ光る、ゼリーのお菓子。食べると頭がピカピカになって、難しい勉強も簡単にできちゃうんだ。このゼリーがあれば、よのが一番かしこい国になれるって、みんな信じているよ。',
    power: 12000,
  },
  provenance: [
    {
      label: 'こまえこども新聞',
      note: '宇宙ゼリーをたべすぎると、おかしの夢しか見られなくなるらしい。',
    },
    {
      label: 'よのぼうけん探検隊',
      note: '土星チョコは、おはかまでとってくると、もっとおいしいというヒミツ。',
    },
    {
      label: 'せんせいのうわさばなし',
      note: '宇宙ゼリーをたべすぎると、授業中ロケットの夢をみるらしい。',
    },
    {
      label: '多摩川カワウソくん通信',
      note: '土星チョコは、川でひろった石に似てるから、あぶないね。',
    },
    {
      label: 'よののママのひみつメモ',
      note: '宇宙ゼリーのきらきらは、夜の駅前のライトをイメージしたんだって。',
    },
    {
      label: 'こまえお菓子研究クラブ',
      note: '土星チョコのムキムキパワーは、みんなで協力して作ったからなんだ！',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
