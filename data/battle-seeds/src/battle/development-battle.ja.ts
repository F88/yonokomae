import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'development-battle',
  themeId: 'development',
  significance: 'medium',
  title: '土地開発を巡る戦い',
  subtitle: '丘陵か、河川敷か。未来都市の設計図',
  narrative: {
    overview:
      'よのは大宮台地を利用した高層開発を推進し、こまえは多摩川の河川敷を活用した低層開発を主張する。未来の都市像をかけた、壮絶なビジョン対決だ。',
    scenario:
      '大宮台地の豊かな土地を利用するよのは、超高層ビルや大規模な商業施設を建設し、空へと伸びる未来都市を夢見ている。これは、武力ではない知の力で天下を統一したよのの、壮大なビジョンを象徴している。一方こまえは、多摩川の恵みを受けた河川敷を利用し、自然と共生する低層住宅やコミュニティ空間を築き、人々の絆を深めることを目指す。これは、強固な共同体を築き、孤高を貫くこまえの精神を体現する。どちらのビジョンが、真に人々の幸福をもたらすか、プレイヤーは判断を迫られる。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '自然と共生する河川敷の守護者',
    description:
      '多摩川の河川敷を活用し、自然と共生するまちづくりを推進する。その計画は、人と自然、そして人々の絆を大切にするこまえの精神の集大成である。',
    power: 28000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '空へと伸びる丘陵の開拓者',
    description:
      '大宮台地の高台に超高層ビルを建設し、新たな都市のシンボルを築き上げる。その開発ビジョンは、よのが持つ未来志向の知性を象徴している。',
    power: 28000,
  },
  provenance: [
    {
      label: '大宮台地',
      note: 'さいたま市を形成する主要な台地',
    },
    {
      label: '多摩川',
      note: 'こまえ市を流れる一級河川',
    },
    {
      label: 'よの未来都市計画プレゼンテーション',
      note: '「空は新たなフロンティアだ」というスローガンが掲げられた。',
    },
    {
      label: 'こまえ自然保護団体「たまがわ会議」',
      note: '「高層ビルより、カワウソが住める川を」という横断幕を掲げた活動記録。',
    },
    {
      label: '建築雑誌「アーバン・フューチャー」',
      note: '「対極の都市開発：よのとこまえ」という特集記事で、両者の思想が比較された。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
