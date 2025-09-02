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
- 他のモード (DEMO、RANDOM-DATA、API など) は本書の制約を受けません。

## シードの配置場所 (TS 推奨)

- 推奨 (TypeScript、ファイルベースの Battle データ):
    - `src/seeds/historical-evidences/battle/*.ts`
- 任意 (JSON):
    - `seeds/historical-evidences/battle/*.json` (自動検出; 可能なら TS を推奨)

注: `src/seeds/random-data/**` 以下のシードは RANDOM-DATA/DEMO モード向けであり、本書の対象外です。

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

- Battle ファイルの形 (モジュールの default export は Battle 互換であること):
    - 最小例と期待される `Battle` フィールドは `src/seeds/historical-evidences/README.md` を参照してください。

## 一意性と検証

- すべての歴史 Battle において `id` は一意でなければなりません。
    - 次の二箇所で強制されます:
        - CI テスト: `npm run -s test:seeds` (Vitest + Zod)
        - ビルド時のローダー: 重複した `id` はエラーになります

## Battle の追加/更新手順 (TS 推奨)

1. `src/seeds/historical-evidences/battle/` 配下に TS ファイルを作成または編集します。
    - 例: `src/seeds/historical-evidences/battle/my-battle.ts`
    - `default` として `Battle` 互換のオブジェクトを export します。
1. `id` がグローバルに一意であることを確認します。
1. ローカルで検証を実行します:
    - `npm run -s test:seeds`
1. 明確な Conventional Commits 形式のメッセージでコミットします。
    - 例:
        - `feat(seeds): add historical battle my-battle`
        - `fix(seeds): correct provenance url for tama-river`

## CI チェック

- `test:seeds` は CI に含まれており、スキーマエラーや重複 `id` で失敗します。
- Lint/Typecheck/Unit tests は PR 上でデフォルトで実行されます。

## トラブルシューティング

- 重複 `id` エラー
    - `src/seeds/historical-evidences/battle/` を検索し、競合を解消してください。
- 静的/動的 import 混在に関するビルド警告
    - 現在は静的のみです。動的な `import()` を呼んでいないか確認してください。
- 大きなバンドルに関する警告
    - 現時点では許容範囲です。シード量が増えた場合に再検討します。

## データエクスポート統合

歴史シードシステムは TSV エクスポート機能と統合されています:

- エクスポートスクリプトはシードベースのデータを外部分析用に処理できます
- 使用例とユーザーボイスは以下でエクスポート可能です:
    - `npm run ops:export-usage-examples-to-tsv`
    - `npm run ops:export-users-voice-to-tsv`
- エクスポートデータソース:
    - `src/data/usage-examples.ts` - カテゴリ付き使用例
    - `src/data/users-voice.ts` - ユーザーの証言とフィードバック

## 参考

- 実装: `src/yk/repo/seed-system/seeds.ts`
- 検証テスト: `src/yk/repo/seed-system/seeds.validation.test.ts`
- Historical Battle の作成: `src/seeds/historical-evidences/README.md`
- モード概要: `docs/DEVELOPMENT_EN.md` (Historical Seed System)
- エクスポートスクリプト: `src/ops/export-*-to-tsv.ts`
