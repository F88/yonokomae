---
lang: ja
title: Deployment Guide
title-en: Deployment Guide
title-ja: デプロイガイド
related:
    - DEPLOYMENT_EN.md has been translated into Japanese as DEPLOYMENT_JA.md.
    - DEPLOYMENT_JA.md is a Japanese translation of DEPLOYMENT_EN.md.
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# デプロイガイド (正規版)

このドキュメントは本プロジェクトの正規デプロイ手順です。`README` には概要のみを残し、詳細はここを参照します。

## 概要

アプリは Vite でビルドされる静的 SPA で、GitHub Pages のパス `/yonokomae/` 配下に配置されます。

重要ポイント:

- 本番では全静的アセット/ルータのベースパスを `/yonokomae/` で始める必要がある。
- GitHub Pages は未知ルートで `404.html` を返すため、`index.html` を複製して SPA フォールバックを成立させる。
- デプロイ対象ディレクトリは `packages/app/dist` (ルート直下 `dist` ではない)。

## スクリプト

| Script                    | 用途                                                                         |
| ------------------------- | ---------------------------------------------------------------------------- |
| `pnpm run build:app`      | アプリのみビルド (依存パッケージビルド済み想定)                              |
| `pnpm run build:ghpages`  | 全ワークスペース → `VITE_BASE_PATH=/yonokomae/` 付きビルド + `404.html` 生成 |
| `pnpm run deploy:ghpages` | 上記ビルド後に `packages/app/dist` を `gh-pages` ブランチに公開              |

`build:ghpages` 内部:

1. `pnpm -r --sort build`
2. `VITE_BASE_PATH=/yonokomae/ pnpm run build:app`
3. `index.html` を `404.html` にコピー

## 環境変数 `VITE_BASE_PATH`

`vite.config` に固定せず環境変数で注入することで、ローカル開発ではルート `/` を維持しつつ、本番のみプレフィックスを適用。

確認チェック:

1. ビルド後コードで `import.meta.env.BASE_URL` が `/yonokomae/`。
2. ハードコードされた `/yonokomae/` がスクリプト/ドキュメント以外に無い。
3. URL 組み立てで `//` が発生していない。

## 代表的なフロー

### 高速 (UI 変更のみ / 依存再ビルド不要)

```bash
pnpm run build:ghpages
pnpm run deploy:ghpages
```

### クリーン (安全策)

```bash
pnpm clean
pnpm install --frozen-lockfile
pnpm run deploy:ghpages
```

### 手動公開 (詳細制御)

```bash
pnpm -r --sort build
VITE_BASE_PATH=/yonokomae/ pnpm run build:app
cp packages/app/dist/index.html packages/app/dist/404.html
gh-pages -d packages/app/dist -m "deploy: manual"
```

## 検証チェックリスト

1. <https://f88.github.io/yonokomae/> にアクセス
2. ハードリロード or `?t=<timestamp>` 付与
3. ネットワークタブで全アセット URL が `/yonokomae/` 始まり
4. SPA 内部遷移後にリロード → 正常表示 (404 フォールバック OK)
5. `packages/app/dist` 内でアセット重複が無い

## トラブルシュート

| 症状           | 想定原因                                 | 対処                                     |
| -------------- | ---------------------------------------- | ---------------------------------------- |
| 深いパスで 404 | `404.html` 未生成 or 誤った publish パス | `build:ghpages` 再実行し `404.html` 確認 |
| CSS/画像欠落   | base プレフィックス欠如                  | 環境変数付きで再ビルド                   |
| JS が古い      | ブラウザキャッシュ                       | ハードリロード or クエリ付与             |
| URL に `//`    | 文字列単純結合                           | `new URL` 利用や両端スラッシュ調整       |
| 空白ページ     | 誤パス公開                               | `packages/app/dist` を正しく指定         |

## CI / 自動化

現状は手動トリガ。CI 移行する場合:

1. タグ or workflow_dispatch で起動
2. pnpm キャッシュ
3. `pnpm run build:ghpages` → `pnpm run deploy:ghpages`

安定までは手動を推奨。

## 将来拡張

Vercel などルート配置が可能なプラットフォームへ移行時は `VITE_BASE_PATH` を除去しルート `/` を前提に調整。

## 変更履歴 (デプロイ)

- 2025-09-06: README から分離し本ガイドを正とした。

## 関連

- README (概要セクション)
- `package.json` スクリプト
- Vite 設定 (`packages/app/vite.config.*`)
