import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_service_optimization',
  themeId: 'community',
  publishState: 'published',
  significance: 'medium',
  title: '近さの行政と大きさの行政',
  subtitle: '小さな距離の温かさか、大きな規模の力か',
  narrative: {
    overview:
      '広域側は、区役所や支所・市民窓口の網で標準化された手続きと迅速な発行業務を整え、' +
      '個別側は、法律・相続・生活困窮などの常設相談で伴走しながら個別事情に合わせて解決へ導く。',
    scenario:
      '政令指定都市の枠組みを持つ広域側は、住民票・各種証明・相談受付などのベース業務を、' +
      '複数拠点の窓口配置と統一手順で平準化し、来訪先を選びやすく、処理時間の見通しを立てやすくする。' +
      '一方、小規模自治体の個別側は、専門分野の担当者を常設し、同一相談の継続対応、関係機関連携、' +
      '家庭事情や就労状況などの背景を踏まえた支援設計で、課題ごとに納得解を探る。' +
      '均一に速いか、必要に深いか——行政サービスの価値はどこで測られるか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '狛江の個別相談サービス',
    subtitle: '市民の悩みに寄り添うきめ細やかな行政',
    description:
      '法律・相続・生活困窮などの常設相談を入口に、継続的に同一相談へ対応し、' +
      '必要に応じて福祉・教育・地域団体と連携して支援の組み合わせを設計する。' +
      '来庁者の事情を踏まえた個別対応で、解決までの道筋を伴走する小規模自治体の強みを示す。',
    power: 82,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'さいたま市の広域行政サービス',
    subtitle: '市民窓口を多数設置する効率的な手続き',
    description:
      '各区役所と市内の支所・市民窓口のネットワークで、住民票・各種証明・戸籍関連などの手続きを標準化。' +
      'どの窓口でも同等の案内と処理を受けられることで、居住地や勤務先に近い拠点を選びやすく、' +
      '多くの利用を広範囲に捌く広域運用の力を発揮する。',
    power: 91,
  },
  provenance: [
    {
      label: 'さいたま市の広域行政サービス',
      url: 'https://www.city.saitama.lg.jp/008/001/p013074.html',
      note: 'さいたま市／支所・市民の窓口をご利用ください',
    },
    {
      label: '狛江市の施設、窓口',
      url: 'https://www.city.komae.tokyo.jp/index.cfm/41,4611,322,html',
      note: '市役所及び各事務所、公民館・図書館、地域センター、体育施設など',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
