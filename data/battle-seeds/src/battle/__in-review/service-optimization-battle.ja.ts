import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_service_optimization',
  themeId: 'community',
  publishState: 'review',
  significance: 'medium',
  title: '個別最適化 vs. 全体最適化のバトル',
  subtitle: '市民一人ひとりへの配慮か、広域への効率化か',
  narrative: {
    overview:
      '与野市が合併によって追求した、広域行政による効率的で統一的なサービスと、' +
      '狛江市が独立によって維持した、市民に寄り添うきめ細やかな行政サービス。',
    scenario:
      '政令指定都市となったさいたま市は、市内各所に区役所や市民の窓口を多数設置し、住民票や証明書の発行といった広域的な行政サービスを効率的に提供している。' +
      'これは、多くの市民に均一なサービスを届けることを目指す、スケールメリットを活かした戦いだ。' +
      '一方、独立を維持した狛江市は、法律、相続、生活困窮など、市民一人ひとりの問題に寄り添う専門的な相談サービスを常設している。' +
      'これは、市民との顔が見える関係性を重視する、きめ細やかな行政の勝利をかけた戦いだ。' +
      '果たして、広域行政の効率性が、小規模自治体の人間的な温かさに勝るのか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '狛江の個別相談サービス',
    subtitle: '市民の悩みに寄り添うきめ細やかな行政',
    description:
      '独立した狛江市が提供する、法律、相続、生活困窮など多岐にわたる専門家による常設相談サービス。' +
      '市民一人ひとりの生活に密着した課題解決を重視する、小規模自治体ならではの行政モデルを体現する。',
    power: 82,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'さいたま市の広域行政サービス',
    subtitle: '市民窓口を多数設置する効率的な手続き',
    description:
      '合併により政令指定都市となったさいたま市が、各区役所や市内25か所の支所・市民の窓口を通じて提供する、効率化された行政手続き。' +
      '多くの住民が利用する公的なサービスを、迅速かつ広範囲に届けることを可能にした。',
    power: 91,
  },
  provenance: [
    {
      label: 'さいたま市の広域行政サービス',
      url: 'https://www.city.saitama.lg.jp/008/001/p013074.html',
      note: 'さいたま市／支所・市民の窓口をご利用ください',
    },
    {
      label:
        '市役所及び各事務所、公民館・図書館、地域センター、体育施設など - 狛江市役所',
      url: 'https://www.city.komae.tokyo.jp/index.cfm/41,4611,322,html',
      note: '市役所及び各事務所、公民館・図書館、地域センター、体育施設など',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
