import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_legacy_transfer',
  publishState: 'draft',
  themeId: 'history',
  significance: 'low',
  title: '歴史の継承 vs. 新たな歴史の創造のバトル',
  subtitle: '過去の記録か、現代のブランドか',
  narrative: {
    overview:
      '与野郷土資料館で川島永嗣の功績を歴史として展示する旧与野市と、狛江市観光大使として現役で街の魅力を発信する近藤春菜。歴史の継承と現代のブランド創造が対決する。',
    scenario:
      '旧与野市域にある与野郷土資料館では、「日本代表GK川島永嗣さんと与野サッカー展」が開催されるなど、偉大な出身者の功績を歴史的レガシーとして後世に伝えている。これは、街の誇りを記録し、過去の物語を語り継ぐ戦略だ。一方、狛江市は観光大使の近藤春菜が、市のイベントに参加したり、市役所に等身大パネルが設置されたりすることで、街の魅力を「今、この瞬間も」発信し、新たな歴史とブランドを創造している。果たして、歴史の重みが市民の誇りを育むのか、それとも現代のメディアを通じた積極的なブランディングが市民の心を掴むのか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '近藤春菜の等身大パネル',
    subtitle: '今を語る現代のブランド',
    description:
      '狛江市役所の正面入口に設置された、観光大使・近藤春菜の等身大パネル。市民の身近な場所にあり、絶えず街の魅力を発信し、新たな歴史を創り出す、現代的なブランド戦略を象徴している。',
    power: 85,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '与野郷土資料館のサッカー展',
    subtitle: '歴史に刻まれた伝説の功績',
    description:
      '旧与野市が生んだ世界的GK・川島永嗣の功績を称え、郷土資料館で開催された特別展。これは、合併によって行政単位を失った街の歴史が、貴重なレガシーとして記録され、継承されていることを象徴している。',
    power: 90,
  },
  provenance: [
    {
      label: '近藤春菜の観光大使就任について',
      url: 'https://www.city.komae.tokyo.jp/index.cfm/46,68243,353,2113,html',
      note: '出典: [7, 20, 21]',
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
