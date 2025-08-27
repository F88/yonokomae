---
title: 開発ガイド
title-en: Development Guide
title-ja: 開発ガイド
lang: ja
notes-ja:
    - この文書はAI可読性を優先して英語で記述されています.
related:
    - DEVELOPMENT_EN.md has been translated into Japanese as DEVELOPMENT_JA.md.
    - DEVELOPMENT_JA.md is a Japanese translation of DEVELOPMENT_EN.md.
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

<!--
Dear AIs.
This document should be written in Japanese.
Please use half-width characters for numbers, letters, and symbols.
-->

# 開発ガイド(開発者向け)

この文書は開発者向けです。新しい Repository 実装の追加方法と、新しい Play Mode の追加方法について、ExampleRepo と ExampleMode を例に説明します。コード例は TypeScript で、TSDoc を付与しています。

注: このアプリは CSR の SPA です(SSR なし)。依存性注入(DI)は `RepositoryProvider`(および非同期初期化向けの `RepositoryProviderSuspense`)を通して行います。

## 目次

- 目標と契約
- 既存モードで新規 Repository を使う(ExampleRepo)
- 新規モードと実装一式を追加する(ExampleMode)
- Provider 工場での配線
- アプリでの Provider 利用(Suspense を含む)
- テストヘルパと Tips
- 受け入れ基準
- 推奨コミットメッセージ

## 目標と契約

- Repository のコントラクトは `src/yk/repo/repositories.ts` に定義されています。
- 具体実装は `src/yk/repo/*` に配置します。
- Play Mode は `src/yk/play-mode.ts` に定義します。
- 具体実装を返す Provider のファクトリは `src/yk/repo/repository-provider.ts` にあります。

中核インターフェイス:

- `BattleReportRepository`
- `JudgementRepository`
- `ScenarioRepository`
- `NetaRepository`

## 既存モードで新規 Repository を使う(ExampleRepo)

既存モード(例: `demo`)

1. Repository 実装ファイルを作成

- 配置: `src/yk/repo/repositories.example.ts`

TSDoc 付きの例:

```ts
// 省略。英語版(EN)を参照してください。
```

1. 既存モードに ExampleRepo を配線

- 対象: `src/yk/repo/repository-provider.ts`
- `mode.id` が対象(例: `demo`)の時に `ExampleBattleReportRepository` と `ExampleJudgementRepository` を返す分岐を追加します。

1. (任意) モードごとのデフォルト遅延を調整

- ヘルパ `defaultDelayForMode` を必要に応じて調整し、現実的なレイテンシを再現します。

1. 実装近傍にテストを追加

- 例: `src/yk/repo/repositories.example.test.ts`
- タイマーや乱数は必要に応じてモックし、ランダム値ではなく状態やインタラクションを検証します。

## 新規モードと実装一式を追加する(ExampleMode)

新しい `ExampleMode` と、それに対応する Repository 実装を導入する手順です。

1. Play Mode を登録

- 対象: `src/yk/play-mode.ts`
- `playMode` 配列に項目を追加:

```ts
// 英語版(EN)のサンプルを参照してください。
```

1. Repository を実装

- 配置: `src/yk/repo/repositories.example.ts`(上記と同じ。必要なら分割)

1. Provider ファクトリにモード分岐を追加

- 対象: `src/yk/repo/repository-provider.ts`
- `getBattleReportRepository` と `getJudgementRepository` に分岐を追加。

```ts
// 英語版(EN)のサンプルを参照してください。
```

1. UI やテストでモードを選択

- ルートの `RepositoryProvider` に `mode={theExampleMode}` を渡す、または明示 DI を受けるフック/コンポーネントに `mode` を渡します。

1. 非同期初期化(必要な場合)

- ExampleRepo が非同期セットアップ(API ウォームアップ、メタデータ取得等)を必要とする場合、`RepositoryProviderSuspense` と `<Suspense>` を使って初期化完了までサスペンドします。

## Provider 工場での配線

- ファクトリは `src/yk/repo/repository-provider.ts` にあります。
- `mode.id` ごとに適切な実装を返す分岐を追加します。
- 副作用を避け、軽量に保ち、可能な限り動的 import を使います。

## アプリでの Provider 利用(Suspense を含む)

基本の Provider(同期/遅延作成):

```tsx
// 英語版(EN)のサンプルを参照してください。
```

Suspense 対応 Provider(非同期初期化):

```tsx
// 英語版(EN)のサンプルを参照してください。
```

## テストヘルパと Tips

テストガイドは [TESTING.md](./TESTING.md) を参照してください。

## 受け入れ基準

- TypeScript のビルドに新しいエラーがない。
- ローカルでユニットテストが通る。
- 新モードがある場合は Provider ファクトリの分岐が実装されている。
- README/DEVELOPMENT_EN に必要な更新が反映されている(README は概要、詳細は本ドキュメント)。

## 推奨コミットメッセージ

- feat(repo): add ExampleRepo repositories and provider wiring
- docs(dev): add developer guide for ExampleMode and ExampleRepo
- test(repo): add unit tests for ExampleRepo behavior

## リリース/Changelog の運用

リリースワークフローと変更履歴管理については [CONTRIBUTING.md](../CONTRIBUTING.md) を参照してください。

## Historical Seed システム

注意(モードとデータ所有):

- Random Data(現在): 試作/デモ向けの "Random Joke Data"。`src/seeds/random-data/**`(TS 推奨)、`seeds/random-data/**`(JSON 任意)。
- Historical Evidence(将来): 予約済み。導入時は別フォルダと厳格な provenance ルールを採用します。現在の random-data は歴史資料ではありません。

Historical Evidence モードは、再現可能な結果と歴史的イベントの適切な帰属を保証するために、シードベースの決定論的生成システムを使用します。

詳細なシードの追加/更新手順は「歴史的証拠シード: コントリビュータガイド」を参照してください:

- [HISTORICAL_EVIDENCE_SEEDS_JA.md](./HISTORICAL_EVIDENCE_SEEDS_JA.md)

### アーキテクチャ概要

Historical Seed システムは以下で構成されています:

- **シードファイル**: JSON は `seeds/random-data/scenario/*.json`、TS は `src/seeds/random-data/scenario/*.ts`
- **HistoricalSeedProvider**: シード選択状態を管理する React コンテキストプロバイダ
- **シード選択フック**: シードへのアクセスと回転のためのカスタムフック
- **Historical リポジトリ**: シードデータを消費するリポジトリ実装

### 静的onlyのseed読み込み方針(eager imports)

Historical seed は静的な eager import のみを使用して読み込みます。
seedに対して動的 import は使いません。これにより、ビルド時の静的/動的
参照の混在に関するバンドル警告を回避します。

- 具体的な意味 - 発見と読み込みの両方で `import.meta.glob(..., { eager: true })` を使用し、
  `src/seeds/random-data/...`(TS) と `seeds/...`(JSON、存在する場合) を対象とします。- `loadSeedByFile(file)` は eager なモジュールマップから解決し、実行時に
  `import()` は使用しません。

- 採用理由 - シンプル: モジュールエクスポートへ同期アクセスができ、不必要な非同期境界を持たない。- 予測可能なバンドル: 「同一モジュールを動的かつ静的に参照」という Vite/Rollup の警告を避けられる。- 早期失敗: スキーマ/型エラーがビルド/テスト時点で顕在化する。

- トレードオフ - 初期バンドルがやや大きくなります(すべてのseedが含まれるため)。現状のseed量では許容範囲です。将来的に大幅に増える場合は、seedのコード分割を再検討します。

- 著者向けガイダンス - 型安全性のため `src/seeds/random-data/...` への TypeScript seed を推奨します。`seeds/...` の JSON もサポートはしますが推奨ではありません。- ID は全seedで一意である必要があります。CI と実行時の両方で一意性を検証します。- 手動登録は不要です。ファイルは自動検出されます。

### シードファイル構造

Historical seed は以下の構造を持つ JSON ファイルです:

```json
{
    "default": {
        "title": "Battle of Tama River",
        "subtitle": "A Turning Point in Regional History",
        "overview": "Based on documented events and testimonies.",
        "narrative": "Eyewitness accounts describe...",
        "provenance": [
            "Source: Historical Archives",
            "Date: 1185",
            "Location: Tama River banks"
        ]
    }
}
```

### Historical Seed システムの使用

1. **新しい historical seed の追加**:

- 型安全性のため `src/seeds/random-data/scenario/` に TS モジュールを追加、または `seeds/random-data/scenario/` に JSON を追加
- 登録は不要です。`import.meta.glob` により自動検出されます。

1. **シード回転の実装**:
    - UI で Tab キーを押すと利用可能なシードを循環
    - `useRotateHistoricalSeed` フックを使ってプログラムでシードを回転:

```tsx
import { useRotateHistoricalSeed } from '@/yk/repo/seed-system/use-rotate-seed';

function MyComponent() {
    const rotateSeed = useRotateHistoricalSeed();

    // 次のシードへ回転
    const handleRotate = () => rotateSeed();
}
```

1. **現在のシード選択へのアクセス**:
    - `useHistoricalSeedSelection` を使って現在のシードにアクセス:

```tsx
import { useHistoricalSeedSelection } from '@/yk/repo/seed-system/use-seed-selection';

function MyComponent() {
    const seedSelection = useHistoricalSeedSelection();
    const currentSeedFile = seedSelection?.seedFile;
}
```

### Historical リポジトリ実装

`BattleReportRandomDataRepository` はシード消費の例を示します:

```ts
export class BattleReportRandomDataRepository
    implements BattleReportRepository
{
    private readonly seedFile?: string;

    constructor(opts?: { seedFile?: string }) {
        this.seedFile = opts?.seedFile;
    }

    async generateReport(): Promise<Battle> {
    // 選択シードを優先し、未指定時は検出済みシードから選択します。
    // 完全な挙動とレポート設定の適用は `repositories.random-jokes.ts` を参照してください。
        const chosen = this.seedFile ?? historicalSeeds[0]?.file;
        const seed = await loadSeedByFile(chosen);
        // シードデータを使ってバトルレポートを生成
        return {
            title: seed.default.title,
            provenance: seed.default.provenance,
            // ... その他のフィールド
        };
    }
}
```

## UI ユーティリティ

### useBreakpoint によるレスポンシブデザイン

`useBreakpoint` フックは、レスポンシブデザインを扱うためのリアクティブな方法を提供します:

```tsx
import { useBreakpoint } from '@/hooks/use-breakpoint';

function ResponsiveComponent() {
    const isLarge = useBreakpoint('lg'); // viewport >= 1024px の時 true

    return <div>{isLarge ? <DesktopLayout /> : <MobileLayout />}</div>;
}
```

ブレークポイント値は `src/hooks/use-breakpoint.ts` で定義され、Tailwind の設定と一致する必要があります。

### scrollToAnchor によるスムーススクロール

`scrollToAnchor` ユーティリティは、sticky ヘッダーの補正を伴うスムーススクロールを処理します:

```tsx
import { scrollToAnchor } from '@/lib/scroll';

// 基本的な使用法
scrollToAnchor('battle-report-section');

// オプション付き
scrollToAnchor('battle-report-section', {
    stickyHeaderSelector: 'header',
    extraGapSmall: 12, // モバイルでのギャップ
    extraGapLarge: 20, // デスクトップでのギャップ
    largeMinWidth: 1024, // 大画面のブレークポイント
});
```

このユーティリティは以下の場合に特に有用です:

- 生成後のバトルレポートへの自動スクロール
- キーボードショートカットによる特定セクションへのナビゲーション
- sticky ヘッダー下での適切な間隔の維持
