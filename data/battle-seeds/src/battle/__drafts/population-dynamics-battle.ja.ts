import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_population_dynamics',
  publishState: 'draft',
  themeId: 'finance',
  significance: 'medium',
  title: '人口の増加 vs. 人口密度のバトル',
  subtitle: '巨大化による人口集積か、小規模化による密な繋がりか',
  narrative: {
    overview:
      '合併により人口100万人規模の巨大都市となったさいたま市(旧与野市)と、全国で2番目に小さい面積で高い人口密度を維持する狛江市。都市のあり方をめぐる人口動態の対立。',
    scenario:
      '与野市が合併して誕生したさいたま市は、人口100万人を超える政令指定都市へと成長した。これは、人口の増加と集積を都市の力とする、規模を追求する戦略だ。一方、狛江市は全国で2番目に面積が小さい市でありながら、高い人口密度を誇り、市民間の密なコミュニティを維持している。これは、規模の拡大ではなく、限られた空間の中で質の高い生活と密な人間関係を育む戦略だ。果たして、人口の増加を力とする巨大都市と、高い人口密度の中で質の高いコミュニティを維持する小規模都市、どちらがより豊かな市民生活を実現できるのか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '全国2番目の面積と高い人口密度',
    subtitle: '小さなまちに宿る密なコミュニティの力',
    description:
      '日本で2番目に面積が小さい市である狛江市は、その小さな領域の中で高い人口密度を誇る。これにより、市民同士の密な繋がりや「顔の見える」コミュニティが形成され、まちの活力を生み出している。',
    power: 85,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '人口100万人を超える巨大都市',
    subtitle: '人口集積がもたらす大都市の力',
    description:
      '浦和市、大宮市、与野市の合併により、さいたま市は人口100万人規模の政令指定都市へと成長した。これは、人口の増加と集積を都市の活力と捉え、規模の拡大を追求する戦略を象徴している。',
    power: 90,
  },
  provenance: [
    {
      label: '与野市とさいたま市の人口について',
      url: 'https://zh.wikipedia.org/zh-cn/%E8%88%87%E9%87%8E%E5%B8%82',
      note: '出典: ',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
