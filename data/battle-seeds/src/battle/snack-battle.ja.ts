import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'snack-battle',
  themeId: 'culture',
  significance: 'low',
  title: 'おかしなだいせんそう',
  subtitle: 'どっちのおかしが いちばんかな?',
  narrative: {
    overview:
      'よの と こまえ に、おいしいおかしが あったんだって!どっちのおかしが いちばんか、しょうぶだ!よーい、どん!',
    scenario:
      'よののおかしは「うちゅうゼリー」。きらきらのおほしさまが はいってるんだ。たべると あたまがよくなって、ロケットも つくれちゃう!こまえのおかしは「どせいチョコ」。たべると つよくなって、たかーい きにも のぼれるんだ。「ぼくのおかしが いちばん!」って、ふたりは けんかしちゃった。たいへん!',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '土星チョコ',
    subtitle: 'めざせみずきりマスター!',
    description:
      'たまがわの いしみたいだけど、チョコだよ。たべると ちからがモリモリわいて、ジャングルジムの てっぺんまで のぼれちゃう！みんなで たべると、もっと なかよしに なれるんだ。',
    power: 30,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '宇宙ゼリー',
    subtitle: 'あたまがピカーン!',
    description:
      'おほしさまが きらきらしてる ゼリーだよ。たべると あたまがピカーン!ってなって、むずかしい パズルも すぐできちゃう。これがあれば、よのが いちばん かしこい くにに なれるんだ!',
    power: 30,
  },
  provenance: [
    {
      label: 'こまえこども新聞',
      note: 'うちゅうゼリーを たべすぎると、おかしのゆめしか みれなくなるんだって。',
    },
    {
      label: 'よのぼうけん探検隊',
      note: 'どせいチョコは、おはかで みつけると、もっと おいしいらしいよ。ひみつだよ。',
    },
    {
      label: 'せんせいのうわさばなし',
      note: 'うちゅうゼリーを たべすぎると、おべんきょうの ときに ロケットのゆめを みちゃうんだって。',
    },
    {
      label: '多摩川カワウソくん通信',
      note: 'どせいチョコは、かわの いしに にてるから、まちがえて たべちゃだめだよ。',
    },
    {
      label: 'よののママのひみつメモ',
      note: 'うちゅうゼリーの きらきらは、えきのまえの ライトみたいに きれいだねって ママがいってた。',
    },
    {
      label: 'こまえお菓子研究クラブ',
      note: 'どせいチョコは、みんなで ちからをあわせて つくったから、つよくなれるんだ!',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
