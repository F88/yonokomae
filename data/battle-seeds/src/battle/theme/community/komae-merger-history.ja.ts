import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'komae-merger-history',
  themeId: 'community',
  publishState: 'review',
  significance: 'medium',
  title: '狛江 合併 和29年(1954年)',
  subtitle: '破天荒町長',
  narrative: {
    overview:
      '1953年の町村合併促進法と東京都の方針のもと、調布・神代・狛江の3町合併が進められた一方で、' +
      '狛江には世田谷区との合併や、単独での市制施行という選択肢も浮上していた。',
    scenario:
      '議会多数派は3町合併を推したが、飯田敬輔町長は都市インフラ整備の観点から世田谷編入を主張。' +
      '公聴会や特別委員会が設けられるなか、臨時会前夜に町長が公印を持ち出すという異例の出来事も記録される。' +
      '最終的に、合併をめぐる議論は「広域へ溶け込むのか」「狛江の独自性を保つのか」という価値選択へと収斂していった。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '狛江の独自性',
    subtitle: '小さな自治の意思決定',
    description:
      '単独で市制施行を目指すという構想は、地域のアイデンティティや意思決定の近さを重んじる姿勢を映す。' +
      '住民生活に近い課題を自律的に解きほぐしていく、小さな自治の可能性が問われた。',
    power: 62,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '与野の立場',
    subtitle: '本件についてはコメントを控える',
    description:
      '本件に関して与野側は公式な見解の表明を控えている。' +
      '立場や評価に関わる事項については、当時の公文書・議事録等の一次資料を参照した上で判断されたい。',
    power: 0,
  },
  provenance: [
    {
      label: '幻と消えた調布、世田谷との合併 (自由民主党狛江総支部)',
      url: 'https://www.komae-jimin.jp/post/%E5%B9%BB%E3%81%A8%E6%B6%88%E3%81%88%E3%81%9F%E8%AA%BF%E5%B8%83%E3%80%81%E4%B8%96%E7%94%B0%E8%B0%B7%E3%81%A8%E3%81%AE%E5%90%88%E4%BD%B5',
      note: '1953年の町村合併促進法下での3町合併推進、飯田敬輔町長の世田谷編入主張、公印持ち出し、須田耕作氏の回顧等を紹介 (政党サイトのコラム）。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
