import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'kids-tech-battle',
  themeId: 'technology',
  significance: 'low',
  title: 'せんせい、そらとぶロボットつくったよ',
  subtitle: 'よのの空飛ぶロボット vs. こまえの土を掘るロボット',
  narrative: {
    overview:
      'よのの子供たちは空飛ぶロボットで空を制覇しようとする。一方こまえの子供たちは、地面を掘るロボットで地下を制覇しようとする。どっちのロボットがすごいかな？',
    scenario:
      'よのの子供たちは、キラキラ光る空飛ぶロボットをたくさん作った。このロボットは、お空から街の様子を全部見ることができて、悪い人がいないか見張っている。一方こまえの子供たちは、泥だらけの地面を掘るロボットを作った。このロボットは、地面の下に埋まっているお宝を探したり、ミミズさんとおしゃべりしたりできる。空の上から全部見るよのか、地面の下のヒミツを探すこまえか。どっちのロボットが世界を幸せにするか、みんなで決めよう！',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '土を掘るロボット',
    description:
      '多摩川の泥んこの中から、お宝をたくさん見つけるのが得意なロボット。お友達のミミズさんと仲良しなので、雨が降ってもへっちゃらだよ。',
    power: 15000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '空飛ぶロボット',
    description:
      'キラキラ光って、とってもかっこいい空飛ぶロボット。お空から街を見張るのが得意だよ。でも、お友達と遊ぶのはちょっと苦手みたい。',
    power: 15000,
  },
  provenance: [
    {
      label: 'こまえこども科学館',
      note: '多摩川の土を掘るロボットコンテストの記録',
    },
    {
      label: 'よのぼうけん探検隊',
      note: '空飛ぶロボットのひみつ',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;