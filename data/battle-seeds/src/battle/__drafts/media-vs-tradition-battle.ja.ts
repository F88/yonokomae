import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_media_vs_tradition',
  publishState: 'draft',
  themeId: 'information',
  significance: 'low',
  title: 'メディアPR vs. 口承文化のバトル',
  subtitle: 'テレビの力か、語り継がれる物語か',
  narrative: {
    overview:
      'テレビで活躍する近藤春菜を起用し、メディアを通じて街の魅力を発信する狛江市と、合併により「消えた市」の物語を市民が語り継ぐ旧与野市。情報発信のあり方を巡る対決。',
    scenario:
      '狛江市は、メディアで活躍する近藤春菜を観光大使に起用することで、テレビや雑誌といった現代的なメディアを通じて、広く街の魅力を発信している。これは、情報伝達のスピードと広範囲への影響力を重視する、効率的なPR戦略だ。一方、行政単位としては消滅した旧与野市の歴史や誇りは、市民の記憶の中で語り継がれ、郷土資料館での展示といった形で後世に伝えられている。これは、直接的なメディアに頼らない、伝統的な情報伝達のあり方だ。果たして、現代メディアの力が、市民の心に根差した口承文化の物語に勝るのか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'メディアを通じた情報発信',
    subtitle: 'テレビの力が届ける狛江の魅力',
    description:
      '近藤春菜のテレビでの露出や、市が積極的に行っているロケ誘致など、現代メディアを駆使した情報発信。これにより、狛江市は全国的な知名度を獲得し、ブランドイメージを構築している。',
    power: 88,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '語り継がれる地域の記憶',
    subtitle: '市民の誇りが支える郷土の物語',
    description:
      '合併により行政単位が消滅した与野市だが、川島永嗣のような出身者の功績や、歴史的な資料館の展示を通じて、市民の心の中でその記憶は生き続けている。これは、メディアに頼らない口承文化の強みを象徴している。',
    power: 85,
  },
  provenance: [
    {
      label: '狛江市のロケ支援事業について',
      url: 'https://www.city.komae.tokyo.jp/index.cfm/46,68243,353,2113,html',
      note: '出典: [21]',
    },
    {
      label: '与野郷土資料館のサッカー展について',
      url: 'https://www.stib.jp/mogitate/2021/07/miniexhibitionatyonokyodoshiryokan.html',
      note: '出典: ',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
