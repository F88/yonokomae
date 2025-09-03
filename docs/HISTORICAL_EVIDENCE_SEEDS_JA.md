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

# 歴史的証拠シード: コントリビューターガイド

このガイドは、`historical-research` プレイモードのデータを追加または更新する方法について説明します。英語版が正であり、この日本語ファイルは翻訳です。

## 対象範囲

このガイドは、`historical-research` モードのリポジトリとシードデータにのみ適用されます。`demo` や `yk-now` のような他のモードは対象外です。

## シードの場所

- **TypeScript (推奨):** `src/seeds/historical-evidences/battle/*.ts`
- **JSON (任意):** `seeds/historical-evidences/battle/*.json`

型チェックの恩恵を受けるために、TypeScript の使用を推奨します。

## 読み込み方針: 静的な Eager Imports

- シードファイルは、ビルド時に静的かつ Eager Imports (`import.meta.glob(..., { eager: true })`) を使用して検出・読み込みされます。
- このアプローチにより、スキーマや型のエラーが早期（ビルドまたはテスト段階）に発見され、非同期の境界を避けることでランタイムのロジックが単純化されます。
- トレードオフとして、初期バンドルサイズがわずかに増加しますが、現在のシードデータの量では許容範囲です。

## スキーマと型

- Battle の正式な型定義は `src/types/types.ts` にある `Battle` 型です。
- シードファイルのデフォルトエクスポートは、`Battle` 型と互換性のあるオブジェクトでなければなりません。
- 最小限の実装例については、`src/seeds/historical-evidences/README.md` を参照してください。

## 一意性とバリデーション

- 各 Battle の `id` プロパティは、すべての歴史的 Battle の中で一意でなければなりません。
- 一意性とスキーマの準拠は、CI チェック (`npm run test:seeds`) によって強制されます。このチェックは Vitest と Zod バリデーションを実行します。

## Battle の追加または更新方法

1.  **シードファイルの作成または編集:**
    `src/seeds/historical-evidences/battle/` に TypeScript ファイルを追加または修正します。
    例: `my-battle.ts`

2.  **Battle データの定義:**
    ファイルが `Battle` 型に準拠したデフォルトエクスポートを持つことを確認してください。`id` が一意であることを確認してください。

3.  **ローカルでのバリデーション実行:**
    コミットする前に、バリデーションスクリプトを実行してエラーがないか確認してください。

    ```bash
    npm run test:seeds
    ```

4.  **変更のコミット:**
    規約に従った明確なコミットメッセージを使用してください。
    - `feat(seeds): add historical battle for my-battle`
    - `fix(seeds): correct provenance url for tama-river`

## CI チェック

`test:seeds` コマンドは CI パイプラインの一部です。スキーマバリデーションに失敗したり、ID が重複している Pull Request はブロックされます。

## トラブルシューティング

- **ID の重複エラー:** `src/seeds/historical-evidences/battle/` 内を検索し、競合している ID を解決してください。
- **バンドルサイズの警告:** 現状では許容範囲です。シードの数が大幅に増加した場合は、よりスケーラブルな非同期読み込み戦略を導入する可能性があります。

## 参考文献

- **実装:** `src/yk/repo/seed-system/seeds.ts`
- **バリデーションテスト:** `src/yk/repo/seed-system/seeds.validation.test.ts`
- **作成例:** `src/seeds/historical-evidences/README.md`
- **開発概要:** `docs/DEVELOPMENT_EN.md`
