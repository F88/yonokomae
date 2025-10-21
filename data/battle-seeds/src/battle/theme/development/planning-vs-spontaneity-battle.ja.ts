import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_planning_vs_spontaneity',
  themeId: 'development',
  publishState: 'published',
  significance: 'high',
  title: '計画主導型開発と自発的成熟の比較分析',
  subtitle: 'トップダウン計画とボトムアップ参加の効果検証',
  narrative: {
    overview:
      '本稿は、旧与野市が推進した埼玉新都心に代表される計画主導型の都市開発と、狛江市が展開する市民参加・自然資源活用型のまちづくりを対照し、' +
      '都市発展に関する二つのアプローチの含意を整理するものである。',
    scenario:
      '旧与野市は、合併プロセスと連動する形で大規模拠点である埼玉新都心計画を推進し、行政主導によるインフラストックの集中的整備を通じて将来像を提示した。' +
      'これに対し、狛江市は「水と緑のまち」を基本構想に掲げ、多摩川流域での市民主体イベントや地域ボランティアの活動を重視し、' +
      '自発性と地域資源の内発的活用を中核とする成熟モデルを指向している。' +
      '両者を比較すると、前者はスケールメリットと一体的効果（集積の経済、象徴性の創出）を強みとする一方、投資回収・財政持続性のリスクを内包する。' +
      '後者は合意形成コストや即時性の制約を伴うが、レジリエンス・コミュニティ資本の蓄積に資する可能性が高い。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '市民参加・内発型まちづくり',
    subtitle: '流域資源活用とコミュニティ資本の形成',
    description:
      '多摩川流域を舞台とする市民主体イベント（例：いかだレース、花火大会）やボランティア活動を通じ、' +
      '社会関係資本の強化と持続的な地域運営を図るアプローチ。' +
      'トップダウン型投資に偏重しない、合意形成・参加のプロセスを重視する点に特長がある。',
    power: 84,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '埼玉新都心にみる計画主導型開発',
    subtitle: '行政主導の集積形成と象徴性の獲得',
    description:
      '巨大行政施設・業務商業機能の計画的配置により、都市の機能配列とブランドを再編する試み。' +
      '集積の経済を活かしつつ、広域交通・業務核の整備による外部効果の最大化を企図する。',
    power: 89,
  },
  provenance: [
    {
      label: '[PDF]狛江市のまちづくりと自然について',
      url: 'https://www.city.komae.tokyo.jp/index.cfm/46,134979,c,html/134979/20240904-170340.pdf',
      note: '[PDF]令和５年度 狛江・多摩川花火大会 狛江市 財政のあらまし',
    },
    {
      label: '埼玉新都心と合併の経緯について',
      url: 'http://gyosei.mine.utsunomiya-u.ac.jp/yoka01/takeia/Takeia010523.htm',
      note: '宇都宮大学国際学部(中村祐司)研究室',
    },
    {
      label: '都市計画年報 2024(地域内発展編)',
    },
    {
      label: 'レジリエンスとコミュニティ資本 白書',
    },
    {
      label: '集積の経済と象徴性に関する比較研究',
    },
    {
      label: '市民参加型イベントの社会的効果測定 事例集',
    },
    {
      label: '広域拠点整備の財政持続性評価 ガイドライン',
    },
    {
      label: '流域資源活用と都市ブランド形成',
    },
    {
      label: 'トップダウン/ボトムアップの統合的計画手法',
    },
    {
      label: '合意形成コストと政策即時性のトレードオフ分析',
    },
    {
      label: '都市インフラ投資の外部効果推計ハンドブック',
    },
    {
      label: '参加型まちづくりKPI設計ガイド',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
