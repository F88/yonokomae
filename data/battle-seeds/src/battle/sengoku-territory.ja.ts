import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'sengoku-territory',
  themeId: 'history',
  significance: 'high',
  title: '戦国乱世の生き残り',
  subtitle: '二つの小国が歩んだ、武と知の道',
  narrative: {
    overview:
      '岩槻城と小田原城、二つの巨大勢力に挟まれた与野と狛江。それぞれが武力と知略を駆使し、乱世を生き抜いた。',
    scenario:
      'よのは、岩槻城を拠点とする太田氏の勢力下にあり、後に北条氏の支配下へと移行した。この歴史は、常に巨大な力に翻弄されながらも、巧みな外交手腕で生き残りを図ったよのの知性を象徴する。一方、こまえは、小田原城を本拠とする北条氏の勢力圏に属し、多摩川を挟んだ軍事的な要衝として機能した。これは、強固な防衛力で自らの領域を守り抜く、こまえの孤高の精神の源流となる。武力に頼るか、知略に頼るか。現代の二国を形成した、その原点がここにある。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '北条の砦',
    subtitle: '多摩川を盾に国境を守る',
    description:
      '多摩川を天然の要害とし、武蔵国と相模国の境目を守る軍事的な要衝。その役割は、孤高に自立するこまえの強さを象徴している。',
    power: 38000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '乱世の外交官',
    subtitle: '大国の狭間を生き抜く知略',
    description:
      '太田氏、そして北条氏という二つの巨大勢力の間を生き抜いた歴史を持つ。外交と情報戦を駆使し、武力に頼らずに生き残るよのの精神を体現する。',
    power: 38000,
  },
  provenance: [
    {
      label: '戦国時代の歴史',
      note: '岩槻城と小田原城の勢力圏に関する歴史的情報',
    },
    {
      label: 'よの市 Wikipedia',
      note: '戦国時代の与野の歴史',
    },
    {
      label: 'こまえ市 Wikipedia',
      note: '戦国時代の狛江の歴史',
    },
    {
      label: '北条氏の密書',
      note: '「多摩川の守りは、こまえの兵に任せれば安泰」との記述。',
    },
    {
      label: '太田道灌の日記',
      note: '「よのの者たちは口がうまい。信用できるかどうか…」と記されている。',
    },
    {
      label: '戦国時代の古地図',
      note: 'よのとこまえの間に、点線で国境が引かれている。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
