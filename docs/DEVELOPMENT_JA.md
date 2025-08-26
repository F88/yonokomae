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

テストガイドは TESTING.md に移動しました。テストスタック、レイアウト/規約、ヘルパ(`renderWithProviders` を含む)、例、トラブルシューティングは TESTING.md を参照してください。

## 受け入れ基準

- TypeScript のビルドに新しいエラーがない。
- ローカルでユニットテストが通る。
- 新モードがある場合は Provider ファクトリの分岐が実装されている。
- README/DEVELOPMENT_EN に必要な更新が反映されている(README は概要、詳細は本ドキュメント)。テスト規約は TESTING.md を参照。

## 推奨コミットメッセージ

- feat(repo): add ExampleRepo repositories and provider wiring
- docs(dev): add developer guide for ExampleMode and ExampleRepo
- test(repo): add unit tests for ExampleRepo behavior

## リリース/Changelog の運用

このプロジェクトは Changesets を用いてバージョニングと変更履歴を管理します。

1. 変更をコミットしたら、変更内容を記述する changeset を作成します。

```bash
npx changeset
```

1. CHANGELOG.md を生成/更新するときは次を実行します。

```bash
npx changeset-changelog
```

既存の CHANGELOG.md を Conventional Changelog で更新することもできます。

```bash
npx conventional-changelog --infile CHANGELOG.md -r 0 --same-file --preset eslint
```
