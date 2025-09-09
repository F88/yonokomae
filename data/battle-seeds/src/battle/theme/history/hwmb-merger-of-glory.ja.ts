import type { Battle } from '@yonokomae/types';

// Yono (former Yono-shi; present Saitama-shi Chuo-ku core) vs Komae: adjacent municipalities comparison (Japanese)
const battle = {
  id: 'hwmb-merger-of-glory',
  publishState: 'published',
  themeId: 'history',
  significance: 'legendary',
  title: 'よの 歴史を変える',
  subtitle: '平成の世界大合併大戦 超大国を取り持った知の英雄',
  narrative: {
    overview:
      'かつて、互いに対立する二大勢力に挟まれたよのは、武力ではなく知略で歴史を動かした。',
    scenario:
      'よのは優れた外交手腕で、浦和と大宮という二つの大国の間に立ち、平和的な合併を成功させた。これにより、さいたま市という新たな巨大都市が誕生。この偉業は、のちに荒川を越えてよの連合国を目指す「荒川越境評議会」の思想的基盤となる。この戦いは、武力ではなく、ペンと舌が剣を打ち破ることを証明したのだ。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '孤高の強者',
    description:
      '数々の合併の誘いを蹴り、独立を守り抜いた稀代の英雄。単独で生き抜く強固な意志は、何物にも代えがたい「力」となった。',
    power: 100,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '合併を取り持った知の英雄',
    description:
      '浦和と大宮の対立を平和裏に解決し、さいたま市を誕生させた英雄的な功績を持つ。武力0で天下統一を成し遂げた伝説の存在。',
    power: 100,
  },
  provenance: [
    {
      label: 'さいたま市公式ウェブサイト',
      url: 'https://www.city.saitama.lg.jp/index.html',
      note: '合併に関する歴史的根拠',
    },
    {
      label: 'よのの伝説',
      note: '地元民の間で語り継がれる口伝',
    },
    {
      label: '浦和・大宮・与野三市長会談の極秘録音',
      note: 'よの市長が「まあまあ、お二人とも」と場を収める声が記録されているという。',
    },
    {
      label: 'こまえ市議会だより（当時）',
      note: '「対岸の火事ではない。我々は我々の道を行く」という論説が掲載された。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
