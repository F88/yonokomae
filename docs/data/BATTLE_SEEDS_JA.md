---
lang: ja
title: Battle Seeds Data Maintenance Guide
title-en: Battle Seeds Data Maintenance Guide
title-ja: バトルシードデータメンテナンスガイド
related:
    - BATTLE_SEEDS_EN.md has been translated into Japanese as BATTLE_SEEDS_JA.md.
    - BATTLE_SEEDS_JA.md is a Japanese translation of BATTLE_SEEDS_EN.md.
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# バトルシードデータメンテナンスガイド

このガイドでは、`data/battle-seeds/` パッケージ内のバトルシードデータのメンテナンス・更新方法について説明します。バトルシードには、実際のデータを使用した与野と狛江の自治体間の統計的比較が含まれています。

## 概要

バトルシードは、人口、面積、人口統計、経済指標など、与野と狛江の自治体のさまざまな側面を比較するデータ駆動型のバトルです。各バトルは事実データを競争形式で提示します。

## パッケージ構造

```
data/battle-seeds/
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── index.ts              # メインエクスポート
    ├── seeds.validation.test.ts # 検証テスト
    └── battle/
        ├── yono-komae-agriculture.ja.ts
        ├── yono-komae-area-comparison.ja.ts
        ├── yono-komae-population-trends.ja.ts
        └── ...
```

## ファイル構造

### バトルデータファイル

**場所**: `data/battle-seeds/src/battle/`
**パターン**: `yono-komae-{topic}.ja.ts`
**言語**: 主に日本語 (`.ja.ts` 拡張子)

各ファイルは `Battle` 型に適合するデフォルトオブジェクトをエクスポートします：

```typescript
import type { Battle } from '@yonokomae/types';

const battle: Battle = {
    id: 'unique-battle-id',
    themeId: 'community', // または 'history', 'culture' など
    significance: 'medium', // 'low' | 'medium' | 'high' | 'legendary'
    title: 'バトルタイトル',
    subtitle: 'バトルサブタイトル',
    narrative: {
        overview: '簡潔な説明...',
        scenario: '詳細なバトルシナリオ...',
    },
    komae: {
        imageUrl: './imgs/neta/komae-example.png',
        title: 'コマえもん',
        subtitle: '狛江のチャンピオン',
        description: '狛江代表データ...',
        power: 42,
    },
    yono: {
        imageUrl: './imgs/neta/yono-example.png',
        title: 'ヨノ丸',
        subtitle: '与野の挑戦者',
        description: '与野代表データ...',
        power: 38,
    },
    provenance: [
        {
            label: 'データソース名',
            url: 'https://example.com/data',
            note: 'ソースに関する追加情報',
        },
    ],
};

export default battle;
```

## データ要件

### Battle 型構造

- **`id`**: 一意識別子 (string)
- **`themeId`**: カテゴリ分けのためのテーマ識別子 (BattleThemeId)
- **`significance`**: 重要度レベル ('low' | 'medium' | 'high' | 'legendary')
- **`title`**: メインバトルタイトル (string)
- **`subtitle`**: セカンダリタイトル (string)
- **`narrative`**: 以下を含むオブジェクト:
    - **`overview`**: 簡潔な説明 (string)
    - **`scenario`**: 詳細なバトルシナリオ (string)
- **`komae`**: 狛江を表す Neta オブジェクト
- **`yono`**: 与野を表す Neta オブジェクト
- **`provenance`**: データソースの配列 (任意)

### Neta 型構造

- **`imageUrl`**: この Neta を表す画像の URL (string)
- **`title`**: Neta のメインタイトルまたは名前 (string)
- **`subtitle`**: 短いサブタイトルまたはキャッチフレーズ (string)
- **`description`**: Neta の詳細な説明 (string)
- **`power`**: 数値的パワーレベル (number)

### 命名規則

**ファイル名**: `yono-komae-{topic}.ja.ts`

例:

- `yono-komae-population-trends.ja.ts`
- `yono-komae-geomorphology-hydrology.ja.ts`
- `yono-komae-commuting-flows.ja.ts`

**バトル ID**: 説明的で一意

- kebab-case を使用
- 両自治体名を含める
- 比較トピックを説明

例:

- `yono-komae-population-2023`
- `yono-komae-area-density-comparison`
- `yono-komae-agricultural-output`

## コンテンツガイドライン

### データソース

- 可能な限り公式政府統計を使用
- `provenance` 配列で適切な帰属を含める
- 元データソースへの URL を提供
- データ解釈のための説明ノートを追加

### パワー計算

パワー値は意味のある比較を反映すべきです：

- より大きい/高い値は通常より高いパワーを取得
- 異なるスケールを適切に正規化
- 比率や百分率の使用を検討
- 説明文書で計算方法論を記録

### 言語とトーン

- タイトル、説明、シナリオには日本語を使用
- 楽しく競争的なトーンを維持
- キャラクター「コマえもん」（狛江）と「ヨノ丸」（与野）を参照
- 関連する自治体の文脈と地域知識を含める

## 新しいバトルの追加方法

1. **データ調査**: 与野と狛江を比較する公式統計を見つける

2. **ファイル作成**: `data/battle-seeds/src/battle/` に新しいファイルを追加

    ```bash
    touch data/battle-seeds/src/battle/yono-komae-your-topic.ja.ts
    ```

3. **バトル実装**: Battle 型構造を使用

    ```typescript
    import type { Battle } from '@yonokomae/types';

    const battle: Battle = {
        id: 'yono-komae-your-topic-2024',
        title: 'あなたのトピック対決',
        // ... バトルデータの残り
    };

    export default battle;
    ```

4. **検証**: テストを実行してコンプライアンスを確保

    ```bash
    cd data/battle-seeds
    pnpm test
    ```

5. **インデックス更新**（必要に応じて): インデックスファイルは自動的にバトルをエクスポートする

## 検証とテスト

### スキーマ検証

パッケージには以下をチェックする検証テストが含まれます：

- Battle オブジェクトが `Battle` スキーマにマッチしている
- すべての必須フィールドが存在している
- すべてのバトルで ID が一意である
- パワー値が有効な数値である

### テスト実行

```bash
# battle-seeds ディレクトリから
cd data/battle-seeds
pnpm test

# プロジェクトルートから
pnpm test
```

### よくある検証エラー

**無効なパワー値**:

- パワーが文字列ではなく数値であることを確認
- 意図的でない限り負の値を避ける
- 合理的な範囲を考慮（0-100 が典型的）

**必須フィールドの欠如**:

- `provenance` を除くすべての Battle フィールドが必要
- `komae` と `yono` の両オブジェクトにすべての Neta フィールドが必要

**重複 ID**:

- 既存のバトルで ID 衝突をチェック
- 説明的で一意な識別子を使用

## ベストプラクティス

### データ精度

- 公式ソースからの統計を検証
- 可能な限り最新のデータを使用
- データ収集日を記録
- データ変換や計算を説明

### 保守性

- 一貫した命名パターンを使用
- 特定の比較にフォーカスしたシナリオを維持
- 過度に複雑なパワー計算を避ける
- 異常または複雑なデータソースを記録

### ローカライゼーション

- 主要コンテンツは日本語
- 適切な自治体用語を使用
- 地域のランドマークと文化を参照
- 既存のバトルとの一貫性を維持

## 例

### シンプルな人口比較

```typescript
const battle: Battle = {
    id: 'yono-komae-population-2023',
    title: '人口対決2023',
    subtitle: '市民パワーバトル',
    overview: '2023年の人口データを基にした対決',
    scenario: 'より多くの市民を抱える自治体が勝利...',
    komae: {
        name: 'コマえもん',
        power: 83,
        description: '狛江市の人口: 83,000人',
    },
    yono: {
        name: 'ヨノ丸',
        power: 135,
        description: 'さいたま市中央区の人口: 135,000人',
    },
    provenance: [
        {
            label: '住民基本台帳人口',
            url: 'https://example.gov.jp/data',
            note: '2023年12月31日現在',
        },
    ],
};
```

## 関連ドキュメント

- **メインデータガイド**: `docs/DATA_MAINTENANCE_JA.md`
- **歴史的証拠**: `docs/data/HISTORICAL_EVIDENCE_SEEDS_JA.md`
- **ニュースシード**: `docs/data/NEWS_SEEDS_JA.md`
- **型定義**: `packages/types/src/battle.ts`
- **検証スキーマ**: `packages/schema/src/battle.ts`

## 付録: リポジトリ層フィルタとの連携

バトルシードは生成時にリポジトリ層の `BattleFilter` UI 経由で (現状は `themeId` のみ)
絞り込み可能です。これはシードファイルの記述方法を変更しません。将来的なフィルタ
(`significance`, 明示的 `id`) は後方互換的に追加予定であり、追加手順は Development Guide に告知されるまで対応不要です。
