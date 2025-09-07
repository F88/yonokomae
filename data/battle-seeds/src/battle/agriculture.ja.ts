import type { Battle } from '@yonokomae/types';

// Yono (Saitama-shi Chuo-ku) vs Komae: agriculture comparison (Japanese)
const battle = {
  id: 'agriculture-2025-ja',
  themeId: 'development',
  significance: 'low',
  title: '農業',
  subtitle: '歴史・現況・農地面積・政策の比較',
  narrative: {
    overview:
      'よのは江戸期から畑作(麦・野菜など)が中心だったが、' +
      '戦後の首都圏拡大で急速に宅地化が進み、農地は大きく減少した。' +
      'こまえは江戸期の宿場・農村に由来し、昭和初期まで養蚕・野菜・花卉栽培が盛ん。' +
      '現在も市内に小規模農地が点在し、都市型農業が維持されている。',
    scenario:
      'YONO は都市化により農地が極少で、市民農園や家庭菜園等の小規模・非営利的営みが中心。' +
      'KOMAE は都市農業の維持・発展を掲げ、防災・環境・景観と両立させた農の機能が評価される。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'KOMAE の農業',
    subtitle: '小規模都市農業/生産額約4.3億円(2020)/耕地約42ha',
    description:
      '江戸〜昭和初期にかけ養蚕・野菜・花卉が盛ん。いまも小規模農地が残り、' +
      '2020年時点の農業生産額は約4.3億円、耕地面積は約42ha。' +
      '都市農業振興基本計画を策定し、防災・環境保全の役割と調和させる取組を推進。',
    power: 48,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'YONO の農業',
    subtitle: '畑作の歴史/宅地化で農地は極少/市民農園など',
    description:
      '江戸期は畑作(麦・野菜)が中心。戦後の宅地化で農地が大幅に減少し、' +
      '統計上、よのの農家数・農地面積はいずれも極めて少ない。' +
      '現在は市民農園や家庭菜園、小規模な都市農業が中心。',
    power: 48,
  },
  provenance: [
    {
      label: 'KWSK River-Crossing Integration Division',
      note:
        '歴史: 与野は畑作中心→戦後宅地化で農地減少。こまえは養蚕・野菜・花卉が盛ん。' +
        '現況: 与野は農家数・農地とも極少で市民農園等が中心。こまえは都市農業が残り生産額約4.3億円(2020)。' +
        '面積: こまえの耕地約42ha(2020)。政策: こまえは都市農業振興基本計画で防災・環境と両立を推進。',
    },
    {
      label: 'こまえの農産物直売所',
      note: '「今朝採れたての枝豆だよ！」という農家さんの声が響く。',
    },
    {
      label: 'よのの市民農園の利用規約',
      note: '「作物の販売は禁止します」という一文がある。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
