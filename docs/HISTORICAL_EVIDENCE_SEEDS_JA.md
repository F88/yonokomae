---
title: Guide for contributing historical evidence.
title-en: Guide for contributing historical evidence.
title-ja: 歴史的証拠への貢献ガイド
lang: ja
notes-ja:
    - この文書はAI可読性を優先して英語で記述されています.
related:
    - HISTORICAL_EVIDENCE_SEEDS_EN.md has been translated into Japanese as HISTORICAL_EVIDENCE_SEEDS_JA.md.
    - HISTORICAL_EVIDENCE_SEEDS_JA.md is a Japanese translation of HISTORICAL_EVIDENCE_SEEDS_EN.md.
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

# 歴史的証拠シード: コントリビュータガイド

このガイドは HISTORICAL_EVIDENCE モードのデータを追加・更新する方法を説明します。
英語版が単一のソース・オブ・トゥルースであり、本書はその日本語訳です。

## 対象範囲

- 本書は HISTORICAL_EVIDENCE モードのリポジトリおよびシードデータにのみ適用されます。
- 他のモード (DEMO、DEMO-2、API など) は本書の制約を受けません。

## シードの配置場所 (TS 推奨)

- 推奨 (TypeScript):
    - `src/seeds/random-data/scenario/*.ts`
    - `src/seeds/random-data/neta/{komae,yono}.ts`
    - `src/seeds/random-data/report/config.ts`
- 任意 (レガシー JSON、非推奨):
    - `seeds/random-data/...` (自動検出; 可能なら TS を推奨)

## 静的のみの読み込み方針 (eager import)

- シードの検出と読み込みには静的かつ eager な import を使用します。
    - 実装は `import.meta.glob(..., { eager: true })` を使用します。
    - `loadSeedByFile(file)` は eager マップから解決します (実行時の `import()` は行いません)。
- 理由
    - 単純さ: 同期アクセスで不要な非同期境界をなくします。
    - 予測可能なバンドル: 静的/動的 import 混在の警告を回避します。
    - 早期失敗: スキーマ/型の問題をビルド/テスト時に顕在化させます。
- トレードオフ
    - 初期バンドルがわずかに大きくなります。現状のシード量では許容範囲です。

## スキーマと型

- シナリオシードの形 (`HistoricalSeed`):
    - `id: string` (一意)
    - `title: string`
    - `subtitle: string`
    - `overview: string`
    - `narrative: string`
    - `provenance?: Array<{ label: string; url?: string; note?: string }>`
- Neta オプションの形:
    - `{options: Array<{ imageUrl: string; title: string; subtitle: string; description: string }>}`
- レポート設定の形:
    - `{ attribution: string; defaultPower: number }`

## 一意性と検証

- すべてのシナリオシードにおいて `id` は一意でなければなりません。
    - 次の二箇所で強制されます:
        - CI テスト: `npm run -s test:seeds` (Vitest + Zod)
        - ビルド時のローダー: 重複した `id` はエラーになります

## シードの追加/更新手順

1. `src/seeds/random-data/...` 配下に TS ファイルを作成または編集します。
    - 例 (scenario):
    - `src/seeds/random-data/scenario/my-scenario.ts`
        - `export default { id, title, ... } satisfies HistoricalSeed;`
1. `id` がグローバルに一意であることを確認します。
1. ローカルで検証を実行します:
    - `npm run -s test:seeds`
1. 明確な Conventional Commits 形式のメッセージでコミットします。
    - 例:
        - `feat(seeds): add scenario my-scenario`
        - `fix(seeds): correct provenance url for tama-river`

## CI チェック

- `test:seeds` は CI に含まれており、スキーマエラーや重複 `id` で失敗します。
- Lint/Typecheck/Unit tests は PR 上でデフォルトで実行されます。

## トラブルシューティング

- 重複 `id` エラー
    - `src/seeds/random-data/scenario/` 全体で該当 `id` を検索し、競合を解消してください。
- 静的/動的 import 混在に関するビルド警告
    - 現在は静的のみです。動的な `import()` を呼んでいないか確認してください。
- 大きなバンドルに関する警告
    - 現時点では許容範囲です。シード量が増えた場合に再検討します。

## 参考

- 実装: `src/yk/repo/seed-system/seeds.ts`
- 検証テスト: `src/yk/repo/seed-system/seeds.validation.test.ts`
- モード概要: `docs/DEVELOPMENT_EN.md` (Historical Seed System)
