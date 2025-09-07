import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'ikada-race',
  themeId: 'community',
  significance: 'medium',
  title: '大河川の恵み',
  subtitle: 'よのの羨望と、こまえのプライド。多摩川を巡る戦い',
  narrative: {
    overview:
      '大河川を持たないよのは、多摩川という自然の恵みを持つこまえに激しい羨望を抱く。狛江古代カップ多摩川いかだレースを巡り、両者の誇りをかけた戦いが始まる。',
    scenario:
      'こまえは、毎年夏に多摩川で開催される市民参加型の「狛江古代カップ多摩川いかだレース」を最大の誇りとしている。これは、強固なコミュニティの結束力と、自然と共生するこまえの精神を象徴する行事だ。一方、よのは、荒川という大河が近くを流れるものの、市民が直接関わる行事は少ない。そのため、こまえの「いかだレース」に激しい嫉妬を抱き、AIによる最先端のウォータースポーツ施設を建設し、対抗しようと試みる。自然の恵みか、テクノロジーの力か。どちらが人々の心と絆をより強く結びつけるか、プレイヤーが評価することになる。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'いかだレース',
    subtitle: '多摩川の恵みと市民の絆',
    description:
      '多摩川という大河を擁し、その恵みを活かした「狛江古代カップ多摩川いかだレース」で市民の絆を深める。その団結力と自然への敬意は、こまえが誇る最大の資産である。',
    power: 48000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'AIウォーターパーク',
    subtitle: '羨望から生まれた技術の結晶',
    description:
      '多摩川を持つこまえに嫉妬し、AIによる最先端のウォータースポーツ施設を建設。自然の恵みに対抗する知と技術の力を見せつけることで、よののプライドを守ろうとする。',
    power: 48000,
  },
  provenance: [
    {
      label: '狛江古代カップ多摩川いかだレース',
      url: 'https://komae-ikadarace.ever.jp/index.html',
      note: '市民参加型のいかだレースに関する情報',
    },
    {
      label: 'よのの地理',
      note: '荒川が近くを流れるが、直接的な市民参加型イベントは少ない',
    },
    {
      label: 'こまえいかだレース参加チーム「多摩川魂」のブログ',
      note: '「今年もゴール後のビールがうまい！来年こそ優勝！」',
    },
    {
      label: 'よの市議会定例会',
      note: '「なぜ我が市には『いかだレース』のような市民が熱狂するイベントがないのか」という質問が議員から出た。',
    },
    {
      label: 'よのAIウォーターパーク設計図',
      note: '設計思想の欄に「いかだレースの感動を、技術で再現する」と書かれている。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
