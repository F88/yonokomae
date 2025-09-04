---
lang: ja
title: Data Maintenance Guide
title-en: Data Maintenance Guide
title-ja: データメンテナンスガイド
related:
    - DATA_MAINTENANCE_EN.md has been translated into Japanese as DATA_MAINTENANCE_JA.md.
    - DATA_MAINTENANCE_JA.md is a Japanese translation of DATA_MAINTENANCE_EN.md.
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# データメンテナンスガイド

このガイドでは、与野狛江戦争プロジェクトにおける全データパッケージのメンテナンス・更新方法について説明します。pnpm monorepo 構造でデータを管理するデータメンテナ向けの中心的な参考文書です。

## 概要

プロジェクトは pnpm monorepo を使用し、異なるドメイン毎に独立したデータパッケージを持ちます：

- **`data/battle-seeds/`** - 与野と狛江を比較するバトルデータ
- **`data/historical-evidence/`** - 歴史的シナリオと証拠
- **`data/news-seeds/`** - ニューススタイルのバトルサンプル

各パッケージは独立しており、共通の型と検証スキーマを共有しながら個別にメンテナンスできます。

## データメンテナ向けクイックスタート

### 前提知識

- TypeScript の基本的な理解
- プロジェクトのバイリンガルドキュメント方針（英語を正とする）への理解

### 共通ワークフロー

1. **適切なデータパッケージに移動**:

    ```bash
    cd data/{package-name}/
    ```

2. **`src/` ディレクトリ内のデータファイルを編集・追加**

3. **変更内容を検証**:

    ```bash
    pnpm test  # 現在のパッケージのみテスト
    # または プロジェクトルートから:
    pnpm test  # 全パッケージをテスト
    ```

4. **変更をコミット**:
    ```bash
    git add data/{package-name}/
    git commit -m "data({domain}): 変更内容を記述"
    ```

## データパッケージ

### バトルシード (`data/battle-seeds/`)

**目的**: 実際の自治体データを使用した与野と狛江の統計的バトル。

**ファイル場所**: `data/battle-seeds/src/battle/`  
**ファイルパターン**: `yono-komae-{topic}.ja.ts`  
**型**: `@yonokomae/types` の `Battle`  
**検証**: `@yonokomae/schema` の `BattleSchema`

**例**:

- `yono-komae-population-trends.ja.ts`
- `yono-komae-area-comparison.ja.ts`
- `yono-komae-agriculture.ja.ts`

**詳細ガイド**: [docs/data/BATTLE_SEEDS_JA.md](data/BATTLE_SEEDS_JA.md) を参照

### 歴史的証拠 (`data/historical-evidence/`)

**目的**: 「戦争」の証拠として提示される架空の歴史的シナリオ。

**ファイル場所**:

- シナリオ: `data/historical-evidence/src/scenario/`
- ネタデータ: `data/historical-evidence/src/neta/`

**ファイルパターン**:

- `{scenario-name}.en.ts` (英語版)
- `{scenario-name}.ja.ts` (日本語版)

**型**: `@yonokomae/types` の `HistoricalSeed`  
**検証**: `@yonokomae/schema` の `HistoricalSeedSchema`

**例**:

- `banner-mixup.en.ts` / `banner-mixup.ja.ts`
- `tama-river.en.ts` / `tama-river.ja.ts`

**詳細ガイド**: [docs/data/HISTORICAL_EVIDENCE_SEEDS_JA.md](data/HISTORICAL_EVIDENCE_SEEDS_JA.md) を参照

### ニュースシード (`data/news-seeds/`)

**目的**: デモンストレーション・テスト用のニューススタイルサンプルバトル。

**ファイル場所**: `data/news-seeds/src/samples/`  
**ファイルパターン**: `news-sample-{number}.ts`  
**型**: `@yonokomae/types` の `Battle`  
**検証**: `@yonokomae/schema` の `BattleSchema`

**例**:

- `news-sample-1.ts`
- `news-sample-2.ts`

**詳細ガイド**: [docs/data/NEWS_SEEDS_JA.md](data/NEWS_SEEDS_JA.md) を参照

## 共通タスク

### 新しいデータの追加

1. データがどのパッケージに属するかを決定
2. そのパッケージの命名規則に従う
3. 適切な TypeScript 型を使用
4. パッケージ内で一意な ID を確保
5. `pnpm test` で検証

### 既存データの更新

1. 適切な `data/{package}/src/` ディレクトリ内のファイルを特定
2. 型構造を保持しながら変更を行う
3. `pnpm test` で変更をテスト

### 多言語化

- **バトルシード**: 主に日本語 (`*.ja.ts`)
- **歴史的証拠**: 英語版と日本語版の両方が必要
- **ニュースシード**: 言語中立（英語ベース）

### 検証とテスト

各データパッケージには以下をチェックする検証テストが含まれます：

- **スキーマ準拠**: データが TypeScript 型にマッチしているか
- **ID の一意性**: パッケージ内で ID が重複していないか
- **必須フィールド**: 全ての必須フィールドが存在するか

パッケージディレクトリからテストを実行：

```bash
cd data/battle-seeds/     # または historical-evidence/ や news-seeds/
pnpm test
```

またはルートから全パッケージをテスト：

```bash
pnpm test
```

### コミットメッセージ規約

フォーマット: `data({domain}): {description}`

例:

- `data(battle): add yono-komae-transportation-networks battle`
- `data(historical): fix typo in tama-river scenario`
- `data(news): update news-sample-1 with latest data`

## 型システム

全データパッケージは以下の共通型を共有：

- **`@yonokomae/types`**: 純粋な TypeScript 型定義
- **`@yonokomae/schema`**: ランタイム検証用 Zod スキーマ

### 主要な型

- **`Battle`**: battle-seeds と news-seeds で使用
- **`HistoricalSeed`**: historical-evidence で使用
- **`Neta`**: バトルと歴史的シード内で使用

## アーキテクチャ原則

1. **関心の分離**: 各データパッケージは 1 つのドメインを処理
2. **型安全性**: 全データが TypeScript 型に対して検証される
3. **独立テスト**: 各パッケージは独立してテスト可能
4. **バイリンガル対応**: 英語を正とし、日本語翻訳
5. **静的ロード**: 全データはビルド時にバンドル（動的インポートなし）

## トラブルシューティング

### よくあるエラー

**スキーマ検証失敗**:

- データオブジェクトが期待される TypeScript 型にマッチしているか確認
- 全ての必須フィールドが存在することを確認
- フィールドタイプ（string、number、array等）を確認

**ID 重複エラー**:

- パッケージ内で競合している ID を検索
- 各データエントリに一意で説明的な ID を使用

**インポートエラー**:

- `@yonokomae/types` から型をインポートしていることを確認
- `@yonokomae/schema` から検証スキーマをインポート

**ビルド失敗**:

- `pnpm test` を実行して特定の問題を特定
- `pnpm typecheck` で TypeScript コンパイルをチェック

### ヘルプの取得

1. 特定のデータパッケージの詳細ガイドを確認
2. 既存のデータファイルを例として参照
3. 検証テストを実行して特定の問題を特定
4. `packages/types/` の型定義を参照

## 関連ドキュメント

- **バトルシード**: [docs/data/BATTLE_SEEDS_JA.md](data/BATTLE_SEEDS_JA.md)
- **歴史的証拠**: [docs/data/HISTORICAL_EVIDENCE_SEEDS_JA.md](data/HISTORICAL_EVIDENCE_SEEDS_JA.md)
- **ニュースシード**: [docs/data/NEWS_SEEDS_JA.md](data/NEWS_SEEDS_JA.md)
- **開発概要**: `docs/DEVELOPMENT_JA.md`
- **RFC 文書**: `docs/RFC_pnpm-monorepo-historical-evidence-seeds.md`
