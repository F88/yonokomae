import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'coder-dojo-battle',
  publishState: 'published',
  themeId: 'technology',
  significance: 'medium',
  title: 'CoderDojo',
  subtitle: 'よののプログラミング教育 vs. こまえの創造性教育',
  narrative: {
    overview:
      'よのは、合併によって手に入れた巨大な力を背景に、プログラミング教育を推し進める。一方こまえは、市民の絆を軸とした草の根の活動で対抗する。どちらが未来を担う人材を育てるか、プレイヤーの評価が問われる。',
    scenario:
      'よのは、AIによる個別最適化されたカリキュラムとロボットプログラミング教材を導入し、子供たちに効率的な技術習得を目指させる。その背景には、「CoderDojoさいたま」という、合併によって手に入れた巨大な教育ハブの存在がある。そこでは、正確なコードと論理的思考力が何よりも重視される。対するこまえは、市民ボランティアが中心となり運営される「CoderDojo狛江」を通じて、子供たちが自由に作りたいものをカタチにする創造性教育を推進。多摩川の自然から着想を得たゲームや、地域の課題を解決するアプリなど、子供たちの好奇心を原動力とする。効率と正確性を追求するよのか、自由な発想とコミュニティの力を信じるこまえか。未来の教育のあり方を巡る戦いだ。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '子供たちの創造性を信じる者',
    description:
      '「CoderDojo狛江」という市民ボランティアによる活動を推進。決まったカリキュラムを持たず、子供たちの自由な発想を尊重する教育哲学は、こまえの市民が持つ創造性とコミュニティの力を象徴している。',
    power: 65,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '効率的な技術習得を目指す者',
    description:
      '合併によって手に入れた巨大な力と、その中心にある「CoderDojoさいたま」を最大限に活用。AIによる個別最適化されたカリキュラムと、最新のロボットプログラミング教材を導入し、未来の技術者として、正確なコードと論理的思考力を子供たちに徹底的に叩き込む。',
    power: 65,
  },
  provenance: [
    {
      label: 'CoderDojo狛江',
      url: 'https://coderdojo-komae.connpass.com/',
      note: 'こまえ市で活動する子ども向けプログラミング道場',
    },
    {
      label: 'CoderDojoさいたま',
      url: 'https://coderdojo-saitama.connpass.com/',
      note: 'さいたま市で活動する子ども向けプログラミング道場',
    },
    {
      label: 'こまえの小学生の自由研究',
      note: '「Dojoでつくった、多摩川のいきものをあつめるゲーム」が市のコンクールで金賞を受賞。',
    },
    {
      label: 'よのの保護者の声',
      note: '「うちの子、ロボット大会で優勝しました！Dojoの先生のおかげです」という喜びのメール。',
    },
    {
      label: '未来のクリエイターマガジン',
      note: '「創造性を育む狛江、技術力を磨くさいたま」として両Dojoの特色が紹介された。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
