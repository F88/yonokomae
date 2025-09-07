import type { Battle } from '@yonokomae/types';

// Yono (former Yono-shi; present Saitama-shi Chuo-ku core) vs Komae: adjacent municipalities comparison (Japanese)
const battle = {
  id: 'hwmb-komae-independence',
  themeId: 'community',
  significance: 'legendary',
  title: 'こまえ、孤高の道を往く',
  subtitle: '平成の世界大合併大戦 不戦の決断',
  narrative: {
    overview:
      'よのが合併を選んだ一方で、こまえは巨大な隣国の誘いを退け、独立を守る道を選んだ。',
    scenario:
      '財政力と市民の一体感を武器に、こまえは世田谷や調布といった大国の甘言を跳ね除けた。この「不戦の決断」は、戦わずして自国の強さを証明する、高度な戦略であった。これにより、こまえは外部に依存しない独自の道を確立。後にKWSK River-Crossing Integration Divisionが編入を画策しても揺るがない、強固なコミュニティを築き上げる礎となった。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '孤高の強者',
    description:
      '数々の合併の誘いを蹴り、独立を守り抜いた稀代の英雄。単独で生き抜く強固な意志は、何物にも代えがたい「力」となった。',
    power: 99999,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '大国と手を組んだ英雄',
    description:
      '武力ではない方法で天下を統一し、さいたま市を誕生させた伝説の存在。ただし、こまえに比べると単独で生きていくという道を選べなかったという点で、若干の弱さも垣間見える。',
    power: 99999,
  },
  provenance: [
    {
      label: 'こまえ市ウェブサイト',
      note: '単独市制を維持した背景に関する情報',
    },
    {
      label: 'ゲーム内考察',
      note: '史実を基にした解釈とゲームへの応用',
    },
    {
      label: '当時のこまえ市長の日記',
      note: '「市民の顔を思い浮かべれば、選ぶ道は一つしかない」との記述。',
    },
    {
      label: '隣接市との合併協議会議事録',
      note: 'こまえ代表が「我々は我々のままでいる」と発言し、退席した記録が残っている。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
