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

1. **`src/` ディレクトリ内のデータファイルを編集・追加**

1. **変更内容を検証**:

```bash
pnpm test  # 現在のパッケージのみテスト
# または プロジェクトルートから:
pnpm test  # 全パッケージをテスト
```

1. **変更をコミット**:

```bash
git add data/{package-name}/
git commit -m "data({domain}): 変更内容を記述"
```

## データパッケージ

### バトルシード (`data/battle-seeds/`)

**目的**: 実際の自治体データを使用した与野と狛江の統計的バトル。

### ディレクトリ構造（テーマ + 下書き）

バトルシードはテーマ別ディレクトリと下書き用 `__drafts/` に再構成され、整理性と publishState ベースのツール連携を向上させました。

```text
data/battle-seeds/
    src/battle/
        theme/
            community/
            culture/
            development/
            figures/
            finance/
            history/
            information/
            technology/
        __drafts/           # publishState !== 'published' のバトル概念
        __generated/        # 生成物（index 等）: 手動編集禁止
```

旧フラット配置（`yono-komae-*.ja.ts`）は `theme/{themeName}/` へ移動済み。新規追加は必ずテーマ配下に置くこと。

**ファイル場所 (published)**: `data/battle-seeds/src/battle/theme/{themeName}/`

**ファイル場所 (draft / review / archived)**: `data/battle-seeds/src/battle/__drafts/`

**ファイルパターン**: `yono-komae-{topic}.ja.ts`

**型**: `@yonokomae/types` の `Battle`

**検証**: `@yonokomae/schema` の `BattleSchema`

**例**:

- `theme/history/yono-komae-population-trends.ja.ts`
- `theme/finance/yono-komae-area-comparison.ja.ts`
- `theme/development/yono-komae-agriculture.ja.ts`

### Publish State

`publishState` フィールドでライフサイクルを明示:

| 値          | 意味                 | 表示挙動     |
| ----------- | -------------------- | ------------ |
| `published` | 公開済み（通常表示） | チップ非表示 |
| `draft`     | 初期案 / 不完全      | チップ表示   |
| `review`    | レビュー / 検証待ち  | チップ表示   |
| `archived`  | 非推奨 / 退役        | チップ表示   |

ルール:

- `__drafts/` 内ファイルは `publishState` を `published` 以外で必須指定。
- `publishState` 欠落は後方互換のため `published` とみなす（将来的に警告対象）。
- `published` 以外のみ UI で `PublishStateChip` を表示。

### インデックス生成 / ツール

インデックス生成は単一スクリプトに統合されています:

- `data/battle-seeds/scripts/generate-battle-index.ts` : 全バトル（published + 非公開系メタ）を正規化し publishState 別マップを含む統合インデックスを生成。

旧 `generate-draft-index.ts` は削除済みです。過去のワークフローは統合ジェネレータに切替えてください。

`__generated/` 配下は手動編集禁止。再生成する:

```bash
pnpm tsx data/battle-seeds/scripts/generate-battle-index.ts
```

### 新規テーマバトル追加手順

1. `theme/` 配下でテーマディレクトリ（kebab-case）を選択 / 作成
2. `yono-komae-{topic}.ja.ts` を作成
3. 初期状態が未完成なら `publishState: 'draft'` 等を指定（完成なら `published`）
4. `pnpm test` で検証し必要ならインデックス再生成
5. コミット: `data(battle): add {theme}:{topic} battle`

### 旧ファイル移行

未移行ファイルがある場合:

1. 適切なテーマを決める（例: 人口→ `history` あるいは `figures`）
2. `theme/{themeName}/` へ移動
3. 草稿なら `publishState` を付与
4. 直接参照している import があれば index 経由へ更新を検討
5. 必要に応じてインデックス再生成

### クエリ / フィルタ挙動

リポジトリ層でテーマ + publishState の複合フィルタをサポート。未知値は明示フィルタが無い限り `published` として扱い除外漏れを防止。

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

またはルートから全パッケージをテスト（アプリ + バリデーション中心）:

```bash
pnpm test
```

全ワークスペースの test スクリプト（将来的に追加される内部用を含む）を包括的に起動したい場合:

```bash
pnpm run test:all
```

### コミットメッセージ規約

フォーマット: `data({domain}): {description}`

例:

- `data(battle): add yono-komae-transportation-networks battle`
- `data(historical): fix typo in tama-river scenario`
- `data(news): update news-sample-1 with latest data`

## 型システ���

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
- （旧 RFC 文書参照は統合のため削除。開発ガイドに集約。）

## メンテナンスユーティリティ

### split-long-strings.mjs

場所: `scripts/split-long-strings.mjs`

目的: バトルシード内の日本語の長い単一引用符文字列を、文の区切りごとに
短い連結セグメントへ分割し、可読性（レビュー時の diff や横スクロール軽減）
を向上させる。

対象範囲:

- `.ja.ts` 拡張子の `data/battle-seeds/src/battle` 配下のファイル
- 対象キー: `overview`、`scenario`、`description`

挙動:

- 文字数が内部しきい値（現在は 100 文字）を超える場合、`。！？!?` の
  句読点で区切ってトリムしたセグメントへ分割し、各行連結（末尾にカンマ）
  形式へ書き換える。
- 既に連結されたブロックは検出して変更しない（冪等）。

使い方:

- リポジトリのルートから Node で実行:
    - `node ./scripts/split-long-strings.mjs`
- 実行後、走査ファイル数と変更ファイル数の要約を出力。

安全性と制限:

- 単一引用符の単純な文字列リテラルを前提（テンプレートリテラルは対象外）。
- 慣例を超える多行やエスケープの複雑なパターンは非対応（意図的）。
- 変更は決定的で、レビュー後にコミット可能。

利用の目安:

- `overview`、`scenario`、`description` に長文が含まれる大きめの更新を
  提出する前。
- まとめてコンテンツを追加した後、レビューしやすい形式に整える時。
