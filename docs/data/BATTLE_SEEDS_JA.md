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

このガイドは `data/battle-seeds/` パッケージ内のバトルシードデータを維持・更新する方法を説明します。バトルシードは与野と狛江の各種統計を（遊び心ある競争形式で）比較したデータです。

## 概要

人口 / 面積 / 人口構成 / インフラ / 財政 / 文化 / 開発 指標など多面的な比較を行い、事実ベースの差異を物語的フォーマットで提示します。各シードは出典 (provenance) を保持し透明性を確保します。

## 更新済みパッケージ構成（テーマ + 下書き + 生成物）

```text
data/battle-seeds/
  package.json
  tsconfig.json
  src/
    battle/
      theme/
        community/
        culture/
        development/
        figures/
        finance/
        history/
        information/
        technology/
      __drafts/            # 非 published シード (publishState !== 'published')
      __generated/         # 自動生成インデックス (編集禁止)
    scripts/
      generate-battle-index.ts  # 統合インデックスジェネレータ (旧 draft 専用廃止済み)
    seeds.validation.test.ts
    index.ts (生成物の再エクスポート)
```

主要ディレクトリ:

- `theme/{themeName}/`: 正式 (または任意 state) のシード配置先
- `__drafts/`: draft / review / archived など非 published 状態の仮置き（位置は補助、真のソースはフィールド）
- `__generated/`: ジェネレータ出力（インデックス / 型集約）

## ファイル配置 & 命名

**配置:** 新規シードは適切なテーマディレクトリへ。概念段階は `__drafts/` でも可。ただしライフサイクル判定は `publishState` が唯一のソース。

**ファイル名パターン:** `yono-komae-{topic}.ja.ts` （日本��主体、kebab-case で簡潔に）。

例:

- `yono-komae-population-trends.ja.ts`
- `yono-komae-agriculture-production.ja.ts`
- `yono-komae-financial-resilience.ja.ts`

## Battle オブジェクト拡張スキーマ

各ファイルは `Battle` を default export:

```ts
import type { Battle } from '@yonokomae/types';

const battle: Battle = {
    id: 'yono-komae-population-trends-2024',
    themeId: 'figures', // テーマフォルダと対応
    significance: 'medium', // 'low' | 'medium' | 'high' | 'legendary'
    publishState: 'published', // 'published' | 'draft' | 'review' | 'archived' (省略時 published)
    title: '人口推移激闘2024',
    subtitle: '長期トレンド対決',
    narrative: {
        overview: '両自治体の人口トレンド比較',
        scenario: '詳細背景...',
    },
    komae: {
        title: 'コマえもん',
        subtitle: '粘りの都市',
        description: '説明...',
        power: 42,
        imageUrl: '',
    },
    yono: {
        title: 'ヨノ丸',
        subtitle: '成長の街',
        description: '説明...',
        power: 55,
        imageUrl: '',
    },
    provenance: [
        {
            label: 'Official Stats',
            url: 'https://example.gov/data',
            note: '2024 annual bulletin',
        },
    ],
};
export default battle;
```

### 必須フィールド

- `id`: リポジトリ全体で一意（集計 / グルーピングで利用、安定維持）
- `themeId`: 既存テーマフォルダ名と一致
- `significance`: UI チップ / 将来重み付け基礎
- `publishState`: ライフサイクル（未指定は published 正規化）
- `narrative.overview` / `narrative.scenario`
- `komae`, `yono`: 各 Neta オブジェクト (`title`,`subtitle`,`description`,`power` 必須)

### 任意フィールド

- `provenance[]`: 強く推奨（透明性確保）
- `imageUrl`: 空でも可（正規化で `undefined` プレフィクス除去）

## ライフサイクル (`publishState`)

| 値        | 意味                     | チップ | 典型配置                 |
| --------- | ------------------------ | ------ | ------------------------ |
| published | 正式公開                 | 非表示 | theme/{themeName}/       |
| draft     | 初期案 / 不完全          | 表示   | \_\_drafts/ または theme |
| review    | 検証 / 編集レビュー保留  | 表示   | \_\_drafts/ または theme |
| archived  | 退役 / 参照用 (履歴保持) | 表示   | \_\_drafts/ または theme |

注意:

- ディレクトリ位置は補助であり `publishState` が真実。
- 未知 state は無視され fallback 的に published と同扱い（追加時はジェネレータ修正要）。

## 統合インデックス生成

単一スクリプトを使用:

```bash
pnpm --filter @yonokomae/data-battle-seeds run generate:battles
```

生成（`__generated/index.generated.ts`）:

- `publishedBattleMap` / `draftBattleMap`
- 状態別マップ集合 `battleMapsByPublishState`
- `publishStateKeys`, `battleSeedsByPublishState`
- `allBattleMap`
- グルーピング: `battlesByThemeId`, `themeIds`

生成物は編集禁止。変更時は再実行。

## 追加手順チェックリスト

1. データ調査（出典確保）
2. テーマ選択 / 必要なら新規作成（命名一貫性確保）
3. ファイル作成 & 必須フィールド記述
4. `publishState` 設定（明示しない場合は published）
5. 検証実行:
    ```bash
    pnpm --filter @yonokomae/data-battle-seeds test
    ```
6. インデックス再生成（テスト内で呼ばれない場合のみ）
7. コミット: `data(battle): add <theme>:<topic> battle`

## 検証 & CI

- スキーマ & 一意性: `seeds.validation.test.ts`
- basename 重複 or `id` 重複: ジェネレータがエラー終了
- `publishState` 欠落: published として受理（警告化の余地）

## パワー値ガイド

- 目安帯域: 0–150（極端値は説明文で根拠明示）
- 偶発的同値は必要性ある場合のみ
- 異種指標は正規化（比率 / 人口比 等）後に power マッピング

## 出典 (Provenance) ベストプラクティス

- 一次ソース（自治体 / 統計局）優先
- `label`, 安定 `url`, 簡潔 `note`（年 / 時点 / 変換）
- 複数可（重要度順）

## テーマ整理指針

異質トピックが 8–10 を超え肥大化するテーマは分割検討。早期細分化は避ける（まず docs PR）。

## よくある落とし穴

| 問題              | 症状                   | 対処                            |
| ----------------- | ---------------------- | ------------------------------- |
| publishState 無し | 暗黙 published         | 明示的に追加                    |
| themeId タイポ    | 期待グループに現れない | フォルダ名と一致させる          |
| id 重複           | テスト失敗 / 生成失敗  | リネーム（全体検索）            |
| narrative 過度    | 翻訳/検証困難          | overview 簡潔 / 詳細は scenario |

## アプリでの利用例

```ts
import {
    battlesByThemeId,
    themeIds,
    battleSeedsByPublishState,
} from '@yonokomae/data-battle-seeds';

const publishedHistory = Object.values(
    battlesByThemeId['history'] || [],
).filter((b) => b.publishState === 'published');
```

## 将来拡張（後方互換想定）

- 新しい publishState (例: `experimental`) 追加
- 状態別重み付け
- 機械可読な出典タクソノミ

## 関連ドキュメント

- メインデータガイド: `docs/DATA_MAINTENANCE_JA.md`
- 歴史的証拠: `docs/data/HISTORICAL_EVIDENCE_SEEDS_JA.md`
- ニュースシード: `docs/data/NEWS_SEEDS_JA.md`
- 型定義: `packages/types/src/battle.ts`
- スキーマ: `packages/schema/src/battle.ts`

## 付録: リポジトリ層フィルタ

現状 `BattleFilter` は `themeId` のみ絞り込み。将来 `significance` / 明示的 `id` などを追加予定（後方互換）。著者側の構造変更不��。
