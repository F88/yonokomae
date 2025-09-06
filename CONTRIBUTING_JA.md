---
lang: ja
title: コントリビューティングガイド
title-en: Contributing Guide
title-ja: コントリビューティングガイド
related:
    - CONTRIBUTING_EN.md has been translated into Japanese as CONTRIBUTING_JA.md.
    - CONTRIBUTING_JA.md is a Japanese translation of CONTRIBUTING_EN.md.
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# コントリビューティングガイド

この pnpm monorepo プロジェクトは、バージョン管理とチェンジログ管理に [Changesets](https://github.com/changesets/changesets) を使用し、コミットメッセージには [Conventional Commits](https://www.conventionalcommits.org/) 仕様に従っています。

## プロジェクト構成

このプロジェクトは、独立したデータパッケージを持つ pnpm monorepo 構造を使用しています:

```
yonokomae/
├── packages/
│   ├── types/          # 純粋な TypeScript 型定義
│   └── schema/         # Zod 検証スキーマ
├── data/
│   ├── battle-seeds/   # 統計バトルデータ
│   ├── historical-evidence/  # 歴史シナリオデータ
│   └── news-seeds/     # ニュース風サンプルデータ
├── src/                # メインアプリケーション
└── docs/               # ドキュメント
```

## データパッケージへのコントリビューション

データ（バトル、歴史シナリオ、ニュースサンプル）をコントリビューションする場合は、専用のデータメンテナンスガイドを参照してください:

- **メインデータガイド**: [docs/DATA_MAINTENANCE_JA.md](docs/DATA_MAINTENANCE_JA.md)
- **バトルシード**: [docs/data/BATTLE_SEEDS_JA.md](docs/data/BATTLE_SEEDS_JA.md)
- **歴史的証拠**: [docs/data/HISTORICAL_EVIDENCE_SEEDS_JA.md](docs/data/HISTORICAL_EVIDENCE_SEEDS_JA.md)
- **ニュースシード**: [docs/data/NEWS_SEEDS_JA.md](docs/data/NEWS_SEEDS_JA.md)

### データコントリビューションワークフロー

1. **適切なデータパッケージに移動**: `cd data/{package-name}/`
2. **データファイルを追加または編集**: `src/` ディレクトリ内で作業
3. **変更を検証**: `pnpm test`
4. **適切なタイプでコミット**: `git commit -m "data({domain}): describe your changes"`

データパッケージには、データの品質と一貫性を保証するため、CI で自動実行される独立したテストと検証があります。

## 開発ワークフロー

1.  **ブランチを作成**: 機能追加やバグ修正のため、`main` から新しいブランチを作成します。
2.  **変更を実施**: コードベースに変更を加えます。
3.  **ローカルでチェック実行**: コミット前に、CI チェックをローカルで実行し、すべてが正常であることを確認します。[ローカルでの CI チェック実行](#ローカルでの-ci-チェック実行)セクションを参照してください。
4.  **変更をコミット**: [コミットメッセージ規則](#コミットメッセージ規則)に従います。
5.  **チェンジセットを作成**: ユーザー向けの変更の場合、チェンジセットを作成します。
    ```bash
    pnpm changeset
    ```
    プロンプトに従って適切なバージョンバンプ（patch、minor、major）を選択し、変更の説明を記述します。
6.  **プッシュして Pull Request を作成**: ブランチを GitHub にプッシュし、`main` に対する Pull Request を作成します。

## コミットメッセージ規則

このプロジェクトは [Conventional Commits 仕様](https://www.conventionalcommits.org/en/v1.0.0/)に従っています。これにより、バージョニングとチェンジログ生成の自動化が可能になります。

コミットメッセージは以下のように構造化する必要があります:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**一般的なタイプ:**

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（空白、フォーマット、セミコロンの欠落など）
- `refactor`: バグ修正も新機能追加もしないコード変更
- `perf`: パフォーマンスを向上させるコード変更
- `test`: 不足しているテストの追加または既存テストの修正
- `chore`: ビルドプロセスやドキュメント生成などの補助ツールやライブラリの変更
- `data`: データパッケージの変更（battle-seeds、historical-evidence、news-seeds）

**データ固有のコミット形式:**

- `data(battle): add yono-komae-transportation battle`
- `data(historical): fix typo in tama-river scenario`
- `data(news): update news-sample-1 with latest content`

## CI/CD パイプライン

CI/CD パイプラインには GitHub Actions を使用します。ワークフローは `.github/workflows/ci.yml` で定義されています。

Pull Request を作成すると、以下のチェックが自動実行されます:

1.  **Lint**: ESLint を使用してコードのスタイルとフォーマット問題をチェックします。
2.  **Typecheck**: 全パッケージの TypeScript 型を検証します。
3.  **Unit tests**: Vitest を使用してユニットテストスイートを実行します。
4.  **データパッケージ検証**: 全データパッケージが有効なスキーマと一意な ID を持つことを保証します:
    - バトルシード検証（`@yonokomae/data-battle-seeds`）
    - 歴史的証拠検証（`@yonokomae/data-historical-evidence`）
    - ニュースシード検証（`@yonokomae/data-news-seeds`）

Pull Request がマージされる前に、全チェックが合格する必要があります。

### ローカルでの CI チェック実行

PR を提出する前に、以下のコマンドをローカルで実行してください:

```bash
# Lint チェック
pnpm run lint

# Typecheck
pnpm run typecheck

# ユニットテスト実行
pnpm run test:unit

# 全テスト実行（データパッケージ検証を含む）
pnpm test

# 全ワークスペースの test スクリプトを包括実行
pnpm run test:all

# 個別データパッケージのテスト
cd data/battle-seeds && pnpm test
cd data/historical-evidence && pnpm test
cd data/news-seeds && pnpm test
```

## リリースワークフロー

新バージョンをリリースする準備ができたら、以下の手順に従います:

1. **バージョンバンプ**: `changeset version` コマンドを実行します。これにより全チェンジセットファイルが消費され、パッケージバージョンと `CHANGELOG.md` が更新されます。

```bash
pnpm changeset version
```

1. **リリースコミットとタグの作成**: 変更がコミットされ、新しいバージョンタグが作成されます。
2. **npm への公開（該当する場合）**: パッケージが npm レジストリに公開されます。
3. **GitHub Pages への展開**: アプリケーションを GitHub Pages にデプロイ (詳細は Deployment Guide 参照)。

```bash
pnpm run deploy:ghpages
```

詳細 (base path / 404 fallback / トラブルシュート): `docs/DEPLOYMENT_JA.md` を参照。

## データエクスポートスクリプト

このプロジェクトには、使用例とユーザーボイス用の TSV エクスポート機能が含まれています:

- `pnpm run ops:export-usage-examples-to-tsv` - 使用例を TSV 形式でエクスポート
- `pnpm run ops:export-users-voice-to-tsv` - ユーザーボイスデータを TSV 形式でエクスポート

これらのスクリプトは `tsconfig.ops.json` の TypeScript 設定を使用し、以下からデータを処理します:

- `src/data/usage-examples.ts` - カテゴリと説明付きの使用例
- `src/data/users-voice.ts` - ユーザーの体験談とフィードバック

エクスポートスクリプトは `src/ops/` ディレクトリにあり、データ分析と外部使用に適した TSV ファイルを生成します。
