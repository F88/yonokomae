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

## 目標と契約

## Reduced Motion(prefers-reduced-motion)

OS の設定で「動作を減らす」を選択することで、アニメーションを減らすことができます。

- スクロール: `src/lib/scroll.ts` と `src/lib/reduced-motion.ts` で最小/即時スクロールに切り替えます。
- CSS のアニメーションは `@media (prefers-reduced-motion: reduce)` を使用して制御します。
    - `src/components/UserVoicesMarquee.css`
    - `src/components/UsageExamplesMarquee.css`
- Carousel の自動再生は、ユーザーの設定に応じて動作を調整します。

### macOS の設定

macOS では、システム環境設定 > アクセシビリティ > 表示 > 動作を減らす から設定できます。

- `api/` - REST API クライアント実装
- `core/` - Repository インターフェイスとプロバイダロジック
- `demo/` - デモ/固定データリポジトリ
- `historical-evidences/` - 厳選された歴史データリポジトリ
- `mock/` - テスト/偽リポジトリ(FakeJudgementRepository のみ)
- `random-jokes/` - シードベースランダムデータリポジトリ(デフォルト)
- `seed-system/` - Historical シード管理システム

中核インターフェイス:

- `BattleReportRepository`
- `JudgementRepository`
- `ScenarioRepository`
- `NetaRepository`

## 既存モードで新規 Repository を使う(ExampleRepo)

既存モード(例: `demo`)で新しいリポジトリ(ExampleRepo)を使用したい場合の手順です。

1. Repository 実装ファイルを作成

- 配置: `src/yk/repo/example/repositories.example.ts`

TSDoc 付きの例:

```ts
// 省略。英語版(EN)を参照してください。
```

1. 既存モードに ExampleRepo を配線

- 対象: `src/yk/repo/core/repository-provider.ts`
- `mode.id` が対象(例: `demo`)の時に `ExampleBattleReportRepository` と `ExampleJudgementRepository` を返す分岐を追加します。

```ts
if (mode?.id === 'example-mode') {
    const { ExampleBattleReportRepository } = await import(
        '@/yk/repo/example/repositories.example'
    );
    return new ExampleBattleReportRepository();
}
```

1. (任意) モードごとのデフォルト遅延を調整

- ヘルパ `defaultDelayForMode` を必要に応じて調整し、現実的なレイテンシを再現します。

1. 実装近傍にテストを追加

- 例: `src/yk/repo/example/repositories.example.test.ts`
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

- 配置: `src/yk/repo/example/repositories.example.ts`(上記と同じ。必要なら分割)

1. Provider ファクトリにモード分岐を追加

- 対象: `src/yk/repo/core/repository-provider.ts`
- `getBattleReportRepository` と `getJudgementRepository` に分岐を追加。

```ts
if (mode?.id === 'example-mode') {
    const { ExampleBattleReportRepository } = await import(
        '@/yk/repo/example/repositories.example'
    );
    return new ExampleBattleReportRepository();
}
```

1. UI やテストでモードを選択

- ルートの `RepositoryProvider` に `mode={theExampleMode}` を渡す、または明示 DI を受けるフック/コンポーネントに `mode` を渡します。

1. 非同期初期化(必要な場合)

- ExampleRepo が非同期セットアップ(API ウォームアップ、メタデータ取得等)を必要とする場合、`RepositoryProviderSuspense` と `<Suspense>` を使って初期化完了までサスペンドします。

## Provider 工場での配線

- ファクトリは `src/yk/repo/core/repository-provider.ts` にあります。
- `mode.id` ごとに適切な実装を返す分岐を追加します。
- 副作用を避け、軽量に保ち、可能な限り動的 import を使います。

## アプリでの Provider 利用(Suspense を含む)

基本の Provider(同期/遅延作成):

```tsx
import React from 'react';
import { RepositoryProvider } from '@/yk/repo/core/RepositoryProvider';
import { playMode, type PlayMode } from '@/yk/play-mode';

export function Root() {
    const [mode] = React.useState<PlayMode>(playMode[0]);
    return <RepositoryProvider mode={mode}>{/* App */}</RepositoryProvider>;
}
```

Suspense 対応 Provider(非同期初期化):

```tsx
import React, { Suspense } from 'react';
import { RepositoryProviderSuspense } from '@/yk/repo/core/RepositoryProvider';
import type { PlayMode } from '@/yk/play-mode';

export function Root({ mode }: { mode: PlayMode }) {
    return (
        <Suspense fallback={<div>Initializing…</div>}>
            <RepositoryProviderSuspense mode={mode}>
                {/* App */}
            </RepositoryProviderSuspense>
        </Suspense>
    );
}
```

## テストヘルパと Tips

テストガイドは [TESTING.md](./TESTING.md) を参照してください。

## E2E テスト方針

E2E は Playwright を使用し、主要なユーザーフローとアクセシビリティの
表面をカバーします。テストは速く、決定的(非確率的)で、ユーザー体験に
直結する振る舞いに集中させます。

原則

- スコープ: `e2e/` 配下にタスク指向の spec を配置します。
- ロケータ: `getByRole(..., { name })` を優先し、セマンティクスが無い
  コンテナ(例: `battle`、`slot-yono`、`slot-komae`)に限って
  `data-testid` を使用します。脆い CSS/XPath は避けます。
- 決定性: 恣意的な待機は避け、`expect(...).toHave*` に依拠します。
  `prefers-reduced-motion` を尊重し、必要に応じてエミュレートします。
- パフォーマンス検証: 長時間/大量ケースは `@performance` タグと
  `slow` 指定を付与し、個別にフィルタ可能にします。
- アクセシビリティ: 重要なコントロールの role と名前を検証します。

アノテーションとタグ

- タグは Playwright の grep 対象です(例: `@performance`、`@a11y`、
  `@smoke`)。
- レポート注記が有用な場合は `test.info().annotations.push(...)` を
  追加します。
- 参考: [Annotations | Playwright](https://playwright.dev/docs/test-annotations)

例

```ts
import { test } from '@playwright/test';

test(
    'appends up to 100 battle containers when Battle is clicked repeatedly',
    {
        tag: ['@performance', '@slow'],
    },
    async ({ page }) => {
        // ... test body ...
    },
);

test('a long-running performance check', async ({ page }) => {
    test.slow();
    test.info().annotations.push({
        type: 'performance',
        description: 'Clicks Battle 100 times and verifies 100 containers',
    });
    // ... test body ...
});
```

## 受け入れ基準

- TypeScript のビルドに新しいエラーがない。
- ローカルでユニットテストが通る。
- 新モードがある場合は Provider ファクトリの分岐が実装されている。
- README/DEVELOPMENT_EN に必要な更新が反映されている(README は概要、詳細は本ドキュメント)。

### 判定の折りたたみ/キャッシュ設定

判定のリクエスト折りたたみと短期キャッシュは、リポジトリごとのコード設定のみです。
環境変数での上書きはありません。

- デフォルト/リポジトリ別の設定は `src/yk/repo/core/judgement-config.ts` を編集
- Provider は `getJudgementCollapseConfigFor(repoId)` で設定を参照
- テスト環境では TTL=0、その他はデフォルトで 60000ms

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

## データエクスポートシステム

アプリケーションは使用例とユーザーボイスデータの TSV(Tab-Separated Values) エクスポート機能を提供します。

### エクスポートスクリプト

`src/ops/` に 2 つの主要なエクスポートスクリプトがあります:

- `export-usage-examples-to-tsv.ts` - 使用例データのエクスポート
- `export-users-voice-to-tsv.ts` - ユーザーボイスデータのエクスポート

これらのスクリプトは npm scripts で実行可能です:

```bash
npm run build:usage-examples-tsv
npm run build:users-voice-tsv
```

### データソース

エクスポートデータは以下から取得されます:

- `src/data/usage-examples.ts` - カテゴリと説明を含む使用例
- `src/data/users-voice.ts` - ユーザーの証言とフィードバック

### エクスポート形式

TSV ファイルはヘッダーと適切にエスケープされたコンテンツを含み、データ分析と外部利用が可能です。

## アクセシビリティとスクリーンリーダーへの取り組み

本プロジェクトは主要なユーザーフローにおいて、スクリーンリーダー(SR)の完全対応を目指します。以下にエンジニアリングの原則、テスト戦略、受け入れ基準を定義します。

指針

- セマンティックな HTML と適切な role を優先し、div/button のアンチパターンを避ける。
- アクセシブルネームは短く安定させる。不要な動的結合は避ける。
- 短い動作名には aria-label、詳細な説明には aria-describedby を用いる。
- すべての主要操作をキーボードで実行可能にし、ショートカットは README に記載する。
- 状態変化(例: レポート生成、エラー)は必要に応じてアナウンスし、フォーカスは可視かつ予測可能に保つ。
- prefers-reduced-motion を尊重し、アニメーション以外の代替を用意する。

実装ノート

- ボタン: aria-label(例: "Battle"、"Reset")で名前を付け、詳細説明は aria-describedby で SR 向けに提供する。
- リージョン: ランドマーク(header、main、nav)と見出しで構造化する。
- 非同期フロー: 進捗/スケルトンに必要に応じて役割/ステータスを与え、不要な live region の乱用は避ける。
- テスト: 重要フローでは getByRole(..., { name }) を優先し、脆弱なセレクタは避ける。セマンティクスが適用できない区画のスコープに限り test id を許可する。

受け入れ基準

- キーボードのみで主要タスク(Battle、Reset、レポートへの移動)を完了できる。
- 対話要素に role と安定したアクセシブルネームがある。
- アクション後のフォーカス遷移が論理的で、必要に応じて戻る。
- スクロール/アニメーションで reduced-motion が尊重される。
- 重要フローに対してアクセシビリティ面を検証するテストがある。

## UI コンポーネント

### UsageExamples コンポーネント

`UsageExamples` コンポーネント(`src/components/UsageExamples.tsx`)はカテゴリ分けされた使用例を表示します:

- レスポンシブなカードレイアウト
- カテゴリベースの整理
- インタラクティブなホバーエフェクト
- モバイル最適化表示

### UserVoices コンポーネント

`UserVoices` コンポーネント(`src/components/UserVoices.tsx`)はユーザーの証言を表示します:

- 水平スクロールマーキーアニメーション
- 属性付きの引用形式
- 様々な画面サイズに対応するレスポンシブデザイン
- `src/components/UserVoicesMarquee.css` のカスタム CSS アニメーション

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
