---
lang: ja
title: News Seeds Data Maintenance Guide
title-en: News Seeds Data Maintenance Guide
title-ja: ニュースシードデータメンテナンスガイド
related:
    - NEWS_SEEDS_EN.md has been translated into Japanese as NEWS_SEEDS_JA.md.
    - NEWS_SEEDS_JA.md is a Japanese translation of NEWS_SEEDS_EN.md.
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# ニュースシードデータメンテナンスガイド

このガイドでは、`data/news-seeds/` パッケージ内のニュースシードデータのメンテナンス・更新方法について説明します。ニュースシードは、デモンストレーション、テスト、および与野・狛江紛争のニュース風プレゼンテーション用のサンプルバトルデータです。

## 概要

ニュースシードは、バトルシステムをニュース風の形式で紹介するサンプルデータとして機能します。バトルがユーザーにどのように提示されるかの現実的な例を提供し、開発とデモンストレーション目的のテストデータとして使用されます。

## パッケージ構造

```
data/news-seeds/
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── index.ts              # メインエクスポート
    ├── seeds.validation.test.ts # 検証テスト
    └── samples/
        ├── news-sample-1.ts
        ├── news-sample-2.ts
        └── ...
```

## ファイル構造

### ニュースサンプルファイル

**場所**: `data/news-seeds/src/samples/`  
**パターン**: `news-sample-{number}.ts`  
**言語**: 言語中立（主に英語ベース）

各ファイルは `Battle` 型に適合するデフォルトオブジェクトをエクスポートします：

```typescript
import type { Battle } from '@yonokomae/types';

const newsSample: Battle = {
    id: 'news-sample-unique-id',
    themeId: 'information',
    significance: 'high',
    title: 'ニュースバトルタイトル',
    subtitle: 'ニュース風サブタイトル',
    narrative: {
        overview: 'ニュース風の簡潔な概要...',
        scenario: '詳細なニュース記事...',
    },
    komae: {
        imageUrl: './imgs/neta/komae-news.png',
        title: '狛江代表',
        subtitle: '最新の展開',
        description: '狛江派閥の詳細...',
        power: 75,
    },
    yono: {
        imageUrl: './imgs/neta/yono-news.png',
        title: '与野代表',
        subtitle: '速報',
        description: '与野派閥の詳細...',
        power: 68,
    },
    provenance: [
        {
            label: 'ニュースソース',
            url: 'https://example-news.com/article',
            note: 'デモンストレーション用の架空のニュースソース',
        },
    ],
};

export default newsSample;
```

## データ要件

### Battle 型構造

ニュースシードは battle-seeds と同じ `Battle` 型を使用します：

- **`id`**: 一意識別子 (string)
- **`themeId`**: テーマ識別子 (ニュースの場合は通常 'information')
- **`significance`**: 重要度レベル ('low' | 'medium' | 'high' | 'legendary')
- **`title`**: ニュース風見出し (string)
- **`subtitle`**: 補足見出し (string)
- **`narrative`**: 以下を含むオブジェクト:
    - **`overview`**: 簡潔なニュース要約 (string)
    - **`scenario`**: 完全なニュース記事内容 (string)
- **`komae`**: 狛江派を表す Neta オブジェクト
- **`yono`**: 与野派を表す Neta オブジェクト
- **`provenance`**: 架空またはデモンストレーション用ソースの配列 (任意)

### ニュース風特性

統計データに焦点を当てる battle-seeds とは異なり、ニュースシードは以下を行うべきです：

- ジャーナリスティックなスタイルで情報を提示
- 物語的要素と文脈を含める
- バランスの取れたニュース的な報道を特徴とする
- 魅力的でストーリー主導のコンテンツを提供

## 命名規則

**ファイル名**: `news-sample-{number}.ts`

例:

- `news-sample-1.ts`
- `news-sample-2.ts`
- `news-sample-breaking.ts`

**バトル ID**: "news" 識別子を含める

- 説明的で一意な名前を使用
- ID に "news" または "sample" を含める
- コンテンツテーマを考慮

例:

- `news-sample-economic-dispute-2024`
- `breaking-news-territorial-claim`
- `sample-cultural-festival-rivalry`

## コンテンツガイドライン

### ニュース執筆スタイル

- プロフェッショナルなジャーナリズムトーンを使用
- 両サイドを公平に提示
- 引用と視点を含める
- 魅力的な物語の流れを維持
- 人間的関心の要素に焦点を当てる

### 架空の要素

これらはサンプル/デモンストレーション用データなので：

- 架空のソースを明確にマーク
- もっともらしいが実在しないシナリオを使用
- 実際のニュースコンテンツをコピーしない
- プロジェクトテーマに適合するオリジナルの物語を作成

### パワーバランス

ニュースサンプルでは：

- 興味深いバトルのために比較的バランスの取れたパワーを使用
- 物語的に正当化されない限り極端なパワー差を避ける
- パワーレベルのストーリー影響を考慮
- ニュースの文脈で意味のあるパワーを使用

## 新しいニュースサンプルの追加方法

1. **コンセプト開発**: 与野・狛江紛争のニュースに値するシナリオを作成

2. **ファイル作成**: `data/news-seeds/src/samples/` に新しいファイルを追加

    ```bash
    touch data/news-seeds/src/samples/news-sample-your-topic.ts
    ```

3. **ニュースコンテンツ執筆**: ジャーナリスティックなスタイルに焦点を当てる

    ```typescript
    import type { Battle } from '@yonokomae/types';

    const newsSample: Battle = {
        id: 'news-sample-your-topic-2024',
        title: '速報: 与野・狛江情勢に新展開',
        subtitle: '継続する自治体間の競争に関する最新情報',
        overview: 'ジャーナリスティックなスタイルでのニュース要約...',
        scenario: '引用、文脈、分析を含む完全なニュース記事...',
        // ... バトルデータの残り
    };

    export default newsSample;
    ```

4. **検証**: テストを実行してコンプライアンスを確保

    ```bash
    cd data/news-seeds
    pnpm test
    ```

5. **インデックス更新**: 新しいサンプルが `src/index.ts` からエクスポートされることを確認

## 検証とテスト

### スキーマ検証

パッケージには以下をチェックする検証テストが含まれます：

- ニュースサンプルが `Battle` スキーマにマッチしている
- すべての必須フィールドが存在している
- すべてのサンプルで ID が一意である
- パワー値が有効な数値である

### テスト実行

```bash
# news-seeds ディレクトリから
cd data/news-seeds
pnpm test

# プロジェクトルートから
pnpm test
```

### よくある検証エラー

**物語的要素の欠如**:

- シナリオが完全なストーリーを語ることを確保
- ニュース風プレゼンテーションに十分な詳細を含める
- 文脈と背景情報を提供

**非現実的なパワー値**:

- パワーを合理的な範囲内に保つ
- パワー差の物語的影響を考慮
- ストーリーにマッチしないパワーを避ける

**弱いソース帰属**:

- 架空のソースであっても、もっともらしい帰属を提供
- 現実的に聞こえるソース名を含める
- デモンストレーションコンテンツに適切な免責事項を追加

## ベストプラクティス

### コンテンツ品質

- 魅力的で読みやすいニュースコンテンツを書く
- 直接引用と人間の視点を含める
- 適切な文脈と背景を提供
- ジャーナリスティックな客観性を維持

### デモンストレーション価値

- 異なるバトルタイプを紹介するシナリオを作成
- 開発者とユーザーに良い例を提供
- 多様なパワーレベルとストーリータイプを含める
- システムの異なる側面をデモンストレート

### 保守性

- サンプル間で一貫した執筆スタイルを使用
- シナリオを焦点を絞って一貫性を保つ
- 過度に複雑または混乱する物語を避ける
- 特別な考慮事項を記録

## 例

### 速報ニュースサンプル

```typescript
const newsSample: Battle = {
    id: 'news-sample-cherry-blossom-controversy-2024',
    title: '桜の名所論争が再燃',
    subtitle: '与野・狛江間で花見スポット優劣を主張',
    overview:
        '春の訪れとともに、両市の桜の名所をめぐる論争が再び話題となっている',
    scenario:
        '今年も桜の季節が到来し、与野公園と狛江市内の桜並木について、どちらがより美しい花見スポットかを巡って議論が白熱している。地域住民からは「歴史ある与野公園の桜は格別」との声がある一方、「狛江の多摩川沿いの桜並木は圧巻」との反論も...',
    komae: {
        name: 'コマえもん',
        power: 82,
        description:
            '多摩川沿いの2.5kmに及ぶ桜並木。約800本のソメイヨシノが川面を彩る絶景スポット。',
    },
    yono: {
        name: 'ヨノ丸',
        power: 78,
        description:
            '明治時代から愛される与野公園の桜。約300本の桜と歴史ある公園の風情が自慢。',
    },
    provenance: [
        {
            label: 'さいたま市公園緑地課',
            url: 'https://example.saitama.jp/parks/yono',
            note: 'サンプルデータ - 実際のソースではありません',
        },
        {
            label: '狛江市観光協会',
            url: 'https://example.komae.jp/tourism/sakura',
            note: 'デモンストレーション用の架空のソースです',
        },
    ],
};
```

### 特集記事サンプル

```typescript
const newsSample: Battle = {
    id: 'news-sample-local-cuisine-showdown',
    title: 'ご当地グルメ対決',
    subtitle: '地域特産品が料理の覇権を競う',
    overview: '代表的な料理同士の友好的な競争が地元食文化を紹介',
    scenario:
        '前例のない料理対決において、地域住民によって推薦された代表的な料理が競い合った。料理評論家とコミュニティメンバーが集まり、それぞれの地域を特徴づける独特の味を評価した...',
    komae: {
        name: '狛江料理大使',
        power: 73,
        description: '伝統的な地元菓子と川辺の食事文化',
    },
    yono: {
        name: '与野食品代表',
        power: 71,
        description: '歴史ある酒造りの伝統と季節の特産品',
    },
    provenance: [
        {
            label: '地元食文化調査2024',
            url: 'https://example.com/food-survey',
            note: 'デモンストレーション用の架空の調査です',
        },
    ],
};
```

## 関連ドキュメント

- **メインデータガイド**: `docs/DATA_MAINTENANCE_JA.md`
- **バトルシード**: `docs/data/BATTLE_SEEDS_JA.md`
- **歴史的証拠**: `docs/data/HISTORICAL_EVIDENCE_SEEDS_JA.md`
- **型定義**: `packages/types/src/battle.ts`
- **検証スキーマ**: `packages/schema/src/battle.ts`
