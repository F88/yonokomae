import type { Battle } from '@yonokomae/types';

// Yono (former Yono-shi; present Saitama-shi Chuo-ku core) vs Komae: adjacent municipalities comparison (Japanese)
const battle = {
  id: 'merger-and-independence',
  themeId: 'history',
  significance: 'legendary',
  title: '二つの小国、二つの道',
  subtitle: '平成の世界大合併大戦 合併か、孤立か。平成の選択',
  narrative: {
    overview:
      '平成の大合併の波が押し寄せる中、よのは合併を選び、こまえは独立を選んだ。この二つの選択が、それぞれの未来を決定づけた。',
    scenario:
      'よのは、浦和と大宮という二つの大国の間で、巧みな外交と知略を駆使し、平和的な合併を成功させた。これにより、さいたま市という新たな巨大都市が誕生し、よのはその中核となった。一方、こまえは、世田谷や調布といった巨大勢力の誘いを退け、独立を貫くことを決断。その強固なコミュニティと財政力を武器に、孤高の道を往く。この二つの異なる選択は、後に『箱舟Y』を巡る争いと、『こまえ』の独立を揺るがす戦いの序章となる。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '孤高の独立者',
    description:
      '巨大な隣国の誘いを断り、独立を勝ち取った英雄。その選択は、強固なコミュニティと自立の精神を育む礎となった。',
    power: 99999,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '歴史を動かす仲介者',
    description:
      '対立する二大勢力の合併を取り持ち、武力ではない方法で天下を統一した知の英雄。その功績は、未来の「箱舟」の思想を生むに至った。',
    power: 99999,
  },
  provenance: [
    {
      label: 'さいたま市公式ウェブサイト',
      note: 'さいたま市誕生の歴史',
    },
    {
      label: 'こまえ市ウェブサイト',
      note: '市制施行から単独市制維持の歴史',
    },
    {
      label: 'ゲーム内設定',
      note: '史実を基にした解釈と物語への応用',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
