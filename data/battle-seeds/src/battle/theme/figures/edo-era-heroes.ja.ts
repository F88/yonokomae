import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'edo-era-heroes',
  publishState: 'published',
  themeId: 'figures',
  significance: 'medium',
  title: '江戸を築きし者たちの戦い',
  subtitle: 'よの vs. こまえ',
  narrative: {
    overview:
      '江戸時代、異なる才能で世を動かした二人の偉人が、故郷の誇りをかけて激突する。武士の誉れか、学問の道か、どちらが歴史に名を刻んだか。',
    scenario:
      'よのは、中山道整備に尽力した武士、大石良雄の気高き精神を掲げ、冷静沈着な指揮で相手を圧倒。' +
      '一方こまえは、多摩川の治水に生涯を捧げた技術者、川崎定孝の飽くなき探求心で、科学と技術の力で勝利を目指す。' +
      '武力と知略の時代、真の英雄はどちらの土地から生まれたのか？',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '川崎定孝',
    subtitle: '治水に挑んだ技術者',
    description:
      '川崎定孝。多摩川の治水事業に生涯を捧げ、こまえの地を洪水から守った技術者。彼の探求心は、こまえの市民が持つ独自の技術開発の精神の源流となっている。',
    power: 60,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '大石良雄',
    subtitle: '街道を整備した武士',
    description:
      '大石良雄。中山道整備に貢献した人物とされ、忠義と知略を併せ持つ。その優れた判断力は、よのが誇る外交と情報戦の精神の礎となった。',
    power: 60,
  },
  provenance: [
    {
      label: '大石良雄',
      note: '中山道の整備に貢献したとされる人物',
    },
    {
      label: '川崎定孝',
      note: '多摩川の治水に尽力した人物',
    },
    {
      label: 'よの宿の旅籠の主人による日記',
      note: '「大石様御一行、大変なご威光であった」との記述が残る。',
    },
    {
      label: '六郷用水沿いの石碑',
      note: '川崎定孝の功績を称え、農民たちが建立したもの。',
    },
    {
      label: '江戸幕府公儀隠密の報告書',
      note: '「両名、それぞれのやり方で民の心を掴んでいる」と分析されている。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
