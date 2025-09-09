import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'ruins-battle',
  publishState: 'published',
  themeId: 'history',
  significance: 'medium',
  title: '古代の先輩後輩バトル',
  subtitle: 'どっちがセンパイ？ 地面の下からこんにちは対決',
  narrative: {
    overview:
      '静かな住宅街、与野と狛江の地下から、突如として古代のライバルが「こんにちは」！これは、どちらが歴史の「センパイ」かを決める、仁義なきマウント合戦の始まりだった。',
    scenario:
      '「こっちの土器、イケてない?」と縄文のセンスを自慢するよの。「いやいや、うちはお米作ってたし」と弥生の安定した暮らしをアピールするこまえ。数千年の時を超えたご近所トラブル、果たしてどちらに軍配が上がるのか!?',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '弥生の末裔',
    subtitle: 'お米こそパワー!',
    description:
      '「みんなで植えて、みんなで食べる!」がモットー。計画的な米作りで安定した社会を築いた、弥生時代からの優等生。その堅実さは現代のこまえにも受け継がれている。',
    power: 58,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '縄文の末裔',
    subtitle: '土器のセンスで勝負!',
    description:
      '「見てこの曲線美!」と土器片手にドヤ顔。自然の中で感性を磨き、アーティスティックな才能を開花させた縄文の末裔。その自由な発想が、現代よのの強み。',
    power: 58,
  },
  provenance: [
    {
      label: '大宮台地',
      note: '多くの縄文時代の遺跡や貝塚が発見されている',
    },
    {
      label: '多摩川沿い',
      note: '弥生時代の集落跡が多数発見されている',
    },
    {
      label: 'よの遺跡発掘現場の看板',
      note: '「歴史的大発見!でも、ご近所には静かにね」と書かれている。',
    },
    {
      label: 'こまえ遺跡から出土した人骨のDNA分析結果',
      note: '現代のこまえ市民と遺伝的特徴が一部一致した、というニュース。',
    },
    {
      label: '古代史専門家による対談',
      note: '「縄文の芸術性と弥生の社会性、どちらが優れているとは言えない。両方素晴らしい」と結論。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
