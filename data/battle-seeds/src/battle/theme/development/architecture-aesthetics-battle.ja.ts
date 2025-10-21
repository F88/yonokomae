import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'architecture-aesthetics-battle',
  themeId: 'development',
  publishState: 'published',
  significance: 'medium',
  title: '建築の美学 4月号',
  subtitle: '垂直都市と水平都市の比較考察',
  narrative: {
    overview:
      'よのの高層スカイラインは、ガラスと鋼を主体とするマテリアリティと密度の制御により、都市景観の垂直性を極限まで可視化する。' +
      '一方、こまえの低層居住は、木と土の質感、通風・採光・緑化の統合により、ヒューマンスケールの水平性を持続的に確保する。' +
      '本稿は、材料・スケール・環境統合の観点から両者の美学を比較検討する。',
    scenario:
      'よのは、カーテンウォールと高強度構造、BIMとスマートビル設備を前提に、ミクストユースによる機能集積と眺望価値の最大化を図る垂直都市モデルである。' +
      'こまえは、木質材料やCLTの活用、パッシブデザイン、歩行者中心の街区計画を通じて、生活環境のレジリエンスと余白の質を高める水平都市モデルを提示する。' +
      '都市景観の象徴性か、日常環境の居住性か——評価軸の選択が結論を分ける。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'ローレイヤード・タウン',
    subtitle: '自然環境と調和する低層居住モデル',
    description:
      '連続する緑道ネットワークと街区スケールに整合した歩行者動線、路地の界面設計により、滞留と通過を切り替える適切なポロシティを確保。' +
      'CLT等の木質材料が持つ触感・熱容量・調湿性と、深い庇や縁側に代表されるパッシブ・ファーストの開口計画が、daylight factor・通風・放射冷却を総合最適化する。' +
      'ブルーグリーンインフラと生態系ネットワークはUHI緩和と雨水マネジメントに寄与し、ユニバーサルデザインとプライバシー勾配の設計が、生活のレジリエンスとウェルビーイングを継続的に担保する。',
    power: 85,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'ハイライズ・メトロポリス',
    subtitle: '先端素材と機能集積による垂直都市モデル',
    description:
      '高強度架構と制振・免震、TMDの組み合わせを基盤に、double-skin facadeと高性能カーテンウォールのエンベロープ設計で日射遮蔽と眺望を両立。' +
      'sky lobby・バーティカルサーキュレーション・インターモダリティを統合したプログラム積層(mixed-use stacking)が、FAR活用と価値捕捉を最大化する。' +
      'BIMに基づくモジュラーMEPと冗長性の高い設備計画は運用EUIを抑制し、LCAに基づくembodied carbon管理と非常時のBCPにより、容積効率・アイデンティティ・レジリエンスを同時に達成する。',
    power: 85,
  },
  provenance: [
    {
      label: '景観レビュー',
      note: '垂直スカイラインの都市象徴性と視認性(legibility)に関する考察。視距離・天空率・昼夜の演出が与える心理的指標を整理。',
    },
    {
      label: '環境工学ノート',
      note: '通風・採光・UHI緩和の統合設計。daylight factorやSVF、アルベドと緑化の組合せが屋外/屋内環境に及ぼす影響を比較。',
    },
    {
      label: 'マテリアル&構法',
      note: 'ダブルスキン/高性能CWの熱貫流・眺望・保守性と、CLT等木質構造の調湿・含水率・音響性能を相互参照。',
    },
    {
      label: '都市動線・プログラム',
      note: '歩行者ネットワークとミクストユースの積層戦略。sky lobby、垂直動線、界面のポロシティが都市活動に与える効果を検討。',
    },
    {
      label: 'エネルギー/MEPレビュー',
      note: 'BIMベースのモジュラーMEPと冗長化設計によるEUI低減・運用性評価。需要応答と熱源切替のシナリオを整理。',
    },
    {
      label: 'レジリエンス/BCP',
      note: 'ブルーグリーンインフラの雨水マネジメント、浸水時の機能継続、マイクログリッドによる分散電源の有効性を総括。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
