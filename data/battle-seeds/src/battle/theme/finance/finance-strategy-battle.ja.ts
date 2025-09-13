import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_finance_strategy',
  themeId: 'finance',
  publishState: 'published',
  significance: 'legendary',
  title: '自立財政の作法',
  subtitle: '合併に頼るか 筋肉を鍛えるか',
  narrative: {
    overview:
      '大規模開発の財政負担を解決するため合併を選んだ与野市と、独自の健全な財政運営で独立を維持した狛江市。' +
      '地方自治体の財政戦略の対立を描く。',
    scenario:
      '与野市は、さいたま新都心の開発による膨大な財政負担を抱え、合併を財政基盤強化のための唯一の道とみなした。' +
      'これは、合併が財政問題を解決する有効な手段であるという、当時の地方自治体が直面した共通の課題を象徴している。' +
      '一方、狛江市は合併に頼らず、独自の健全な財政運営を継続。' +
      '将来負担の項目で全国19位という高い評価を得ており、独立が財政的にも可能であることを証明した。' +
      'この戦いは、財政の安定を合併による規模の利益に求めるか、独立による自立的な運営に求めるかという、現代の地方自治体にとっての根本的な選択を問うものだ。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '狛江の健全財政',
    subtitle: '合併に頼らない自立した財政運営',
    description:
      '全国の市区町村財政健全度ランキングで上位に位置し、特に将来負担の項目で高い評価を得ている狛江市。' +
      '合併に頼ることなく、独自の財政運営で行政サービスの質を維持している。',
    power: 88,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '埼玉新都心開発の財政負担',
    subtitle: '合併を必然とした巨大プロジェクトの重み',
    description:
      'さいたま新都心の開発が旧与野市に膨大な財政負担をもたらし、合併の強い動機となった。' +
      'これは、大都市構想という夢の裏にある、現実的な財政的課題を象徴している。',
    power: 85,
  },
  provenance: [
    {
      label: '狛江市の財政健全度について',
      url: 'https://www.seikatsu-guide.com/keyword/2500/13/13219/',
      note: '狛江市の「財政」関連データ｜生活ガイド.com',
    },
    {
      label: '与野市合併の財政的理由について',
      url: 'http://gyosei.mine.utsunomiya-u.ac.jp/yoka01/takeia/Takeia010523.htm',
      note: '宇都宮大学国際学部(中村祐司)研究室',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
