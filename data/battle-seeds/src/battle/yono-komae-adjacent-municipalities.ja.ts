import type { Battle } from '@yonokomae/types';

// Yono (former Yono-shi; present Saitama-shi Chuo-ku core) vs Komae: adjacent municipalities comparison (Japanese)
const battle = {
  id: 'yono-komae-adjacent-municipalities-2025-ja',
  themeId: 'community',
  significance: 'low',
  title: '隣接自治体',
  subtitle: 'よの(現・よの連合国よの主要部)とこまえの周辺環境',
  narrative: {
    overview:
      'よの(8.29 km², 約9.7万人)は合併直前、北側の旧大宮市(128.32 km², 約48.9万人)と南側の旧浦和市(85.50 km², 約50.5万人)に挟まれていた。' +
      'こまえ(6.39 km², 約8.3万人; 2023年)は、世田谷区(58.05 km², 約93万人)・調布市(21.58 km², 約24.3万人)・川崎市(143.01 km², 約154万人)に隣接する。',
    scenario:
      '規模の観点では、よのは隣接する旧浦和/旧大宮に対して面積・人口ともに約1/10規模、こまえも世田谷区や川崎市に対し桁違いに小さい。' +
      'いずれも「小国が大国に囲まれる」構図で、生活圏/通勤圏の相互依存や、越境インフラ・行政連携の重要性が高いことを示唆する。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'KOMAE の隣接状況',
    subtitle:
      '世田谷区・調布市・川崎市に接する小面積自治体(6.39 km², 約8.3万人)',
    description:
      'こまえは都内でも屈指のコンパクトな市域。隣接は大規模都市/区が中心で、人口・経済規模の差が顕著。' +
      '鉄道/幹線道路/河川空間を介した結節が強く、サービス供給や雇用の面で越境依存が高水準となりやすい。',
    power: 45,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'YONO(よの→現よの主要部) の隣接状況',
    subtitle:
      '旧浦和市・旧大宮市に囲まれた小規模都市(8.29 km², 約9.7万人; 合併直前)',
    description:
      'よのは政令市移行前、旧浦和/旧大宮という大規模市に挟まれていた。面積・人口ともに約1/10規模で、' +
      '通勤/商業/行政サービスの広域補完が常態化。合併後は中核拠点(さいたま新都心等)との一体化が進展。',
    power: 45,
  },
  provenance: [
    {
      label: 'GGRKS River-Crossing Integration Division',
      note:
        'よのの隣接: 旧浦和市(85.50 km², 約50.5万人)、旧大宮市(128.32 km², 約48.9万人)。' +
        'こまえの隣接: 世田谷区(58.05 km², 約93万人)、調布市(21.58 km², 約24.3万人)、川崎市(143.01 km², 約154万人)。' +
        '分析: 両者とも周辺は大規模都市で、相対的に小規模(約1/10)であることが示唆される。',
    },
    {
      label: 'こまえ市民の声',
      note: '「買い物は二子玉川、遊びは渋谷。でも帰ってくるのは、やっぱりこまえ」',
    },
    {
      label: '旧よの市民の回想',
      note: '「浦和にも大宮にもよく行ったけど、俺たちは与野人だっていう誇りがあったよ」',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
