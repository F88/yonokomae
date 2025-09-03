---
title: 開発ガイド
title-en: Development Guide
title-ja: 開発ガイド
lang: ja
notes-ja:
    - この文書はAI可読性を優先して英語で記述されています.
related:
    - DEVELOPMENT_EN.md has been translated into Japanese as DEVELOPMENT_JA.md.
    - DEVELOPMENT_JA.md is a Japanese translation of DEVELOPMENT_EN.md.
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

# 開発ガイド(開発者向け)

## アーキテクチャ概要

アーキテクチャはモジュラーデザインを採用し、コンポーネント、リポジトリ、プレイモード間の関心を明確に分離します。主な構成要素は次のとおりです:

- コンポーネント: ユーザーと対話する UI コンポーネント。
- RepositoryProvider: コンテキストプロバイダ。コンポーネントへ適切なリポジトリ実装を供給します。
- フック: リポジトリとのやり取りのロジックをカプセル化したカスタムフック。
- リポジトリ: 基盤データソースを抽象化するデータアクセス層。

### yk-now: ニュース駆動・マルチソース バトルレポート

GitHub Pages のような静的ホスティングでも、ニュース駆動の経路をローカル(ファイル)と API バックエンドをブレンドして試せます。ファクトリはローカルとリモート結果を重み付きで合成するマルチソースリポジトリを返します。

- PlayMode id: `yk-now`
- Env:
    - `VITE_BATTLE_RANDOM_WEIGHT_API`(0..1、既定 `0.5`) — API とローカルのブレンド比
    - `VITE_NEWS_REPORT_CACHE_TTL_MS` — ニュース API 結果のメモ化 TTL(ms)
    - `VITE_API_BASE_URL` — API のベース URL。既定は `/api`
- Notes:
    - 静的ホスティングでは `VITE_API_BASE_URL` をスタブやプロキシへ向けてもよいです。ローカルのみでもファイルソースで動作します。
    - 初期バンドルを小さく保つため、実装は動的 import で遅延読み込みされます。

これにより、呼び出し側は現状でも安定し、将来は UI の変更なく実 API へスワップ可能です。

### 共有バトルシードローダー(news + historical)

単一の共有ローダーを使って、複数のリポジトリに跨る Battle シードファイルの探索、読込、正規化、検証を行います。

- ファイル: `src/yk/repo/core/battle-seed-loader.ts`
- 利用者: HistoricalEvidencesBattleReportRepository、ファイルベース News リポジトリ
- 入力
    - `roots: string[]`(例: `['/seeds/historical-evidences/battle/', '/src/seeds/historical-evidences/battle/']`)
    - `file?: string` 任意。特定のファイル名(ルートからの相対)を指定して決定的に読み込む
- 出力: `Promise<Battle>`(完全に正規化され、Zod で検証済み)
- 振る舞い
    - 静的 eager グロブでモジュールを探索:
        - `/seeds/**/*.{ts,js,json}` と `/src/seeds/**/*.{ts,js,json}`
        - 渡された `roots` にフィルタし、`file` があればそれ、なければランダムに選択
    - 正規化デフォルトを適用し、共有 `BattleSchema` で検証
    - markdown などコード以外は無視。ts/js/json のみ対象
- シード作成ルール
    - Battle 互換オブジェクトを default export(TypeScript 推奨)
    - リポジトリ種別ごとの配置:
        - News: `src/seeds/news/*.ts`
        - 歴史バトル: `src/seeds/historical-evidences/battle/*.ts`
            - 任意の JSON ミラー: `seeds/historical-evidences/battle/*.json`

なぜ共有するか

- 正規化とスキーマ検証を 1 箇所で保守
- リポジトリ間で同一の振る舞い。テストしやすく、進化させやすい

## 新しい Play Mode または Repository の追加方法

このセクションは開発者向けです。ExampleRepo と ExampleMode を例に、Repository 実装の追加方法と Play Mode の追加方法を説明します。すべてのコード例は TypeScript で、TSDoc コメント付きです。

注: アプリは CSR の SPA(SSR なし)です。依存性注入(DI)は `RepositoryProvider`(非同期初期化には `RepositoryProviderSuspense`)で提供されます。

### 目標と契約(Contracts)

- 明確なリポジトリ契約は `src/yk/repo/core/repositories.ts` に定義。
- 実装は `src/yk/repo/*` 配下に配置。
- Play Mode は `src/yk/play-mode.ts` に定義。
- 具体的なリポジトリを返すプロバイダファクトリは `src/yk/repo/core/repository-provider.ts` に配置。

コアインターフェイス:

- `BattleReportRepository`
- `JudgementRepository`
- `ScenarioRepository`
- `NetaRepository`

### アーキテクチャ図(Mermaid)

データと DI の高レベルフロー:

````mermaid
flowchart TD
  A["Components / App"]
  B["RepositoryProvider (Context)"]
  C["Hooks: use-generate-report / use-judgement"]
  D["Repos from Context"]
  E["Factories: get*Repository(mode)"]
  F["Implementation: Fake / Historical / Future API"]
  G["Domain Data: Battle / Verdict"]

  A --> B
  A --> C
  C -->|provided?| D
  C -->|fallback| E
  E --> F
  F --> G
  G --> C
  C --> A
```ts

バトルレポート生成のシーケンス:

```mermaid
sequenceDiagram
    participant U as User
    participant UI as UI (Button)
    participant H as use-generate-report
    participant X as Repo Context (optional)
    participant F as Factory (getBattleReportRepository)
    participant R as Repo Impl (Fake/Historical)

    U->>UI: Click "Battle"
    UI->>H: generateReport()
    H->>X: useRepositoriesOptional()
    alt Provider present
        H->>R: battleReport.generateReport({ signal })
    else No provider
        H->>F: getBattleReportRepository(mode)
        F-->>H: Repo instance
        H->>R: generateReport({ signal })
    end
    R-->>H: Battle
    H-->>UI: setState(success)
````

インターフェイスと実装:

```mermaid
classDiagram
  class BattleReportRepository {
    +generateReport(options) Promise<Battle>
  }
  class JudgementRepository {
    +determineWinner(input, options) Promise<Verdict>
  }
  class ScenarioRepository {
    +generateTitle() Promise<string>
    +generateSubtitle() Promise<string>
    +generateOverview() Promise<string>
    +generateNarrative() Promise<string>
  }
  class NetaRepository {
    +getKomaeBase() Promise<...>
    +getYonoBase() Promise<...>
  }
  class FakeBattleReportRepository
  class FakeJudgementRepository
  class HistoricalNetaRepository

    HistoricalEvidencesBattleReportRepository ..|> BattleReportRepository
  FakeJudgementRepository ..|> JudgementRepository
    %% NetaRepository は現在、random-data seeds をヘルパ関数経由で供給
```

### 既存 Play Mode 向けに新しい Repository を追加する

既存モード(例: `demo`)の下で新しいリポジトリ(ExampleRepo)を追加して利用する場合の手順です。

注: リポジトリ実装は `src/yk/repo/` 配下で種類別に整理されています:

- `api/` - REST API クライアント実装
- `core/` - Repository インターフェイスとプロバイダロジック
- `demo/` - デモ/固定データリポジトリ
- `historical-evidences/` - 厳選された歴史データリポジトリ
- `mock/` - テスト/偽リポジトリ(FakeJudgementRepository のみ)
- `historical-evidences/` - シードベースの歴史的エビデンスリポジトリ(デフォルト)
- `seed-system/` - 歴史的シード管理システム

1. Repository 実装ファイルを作成

- 位置: `src/yk/repo/example/repositories.example.ts`

TSDoc 付きの例:

```ts
// src/yk/repo/example/repositories.example.ts
import type {
    BattleReportRepository,
    JudgementRepository,
    Verdict,
} from '@/yk/repo/core/repositories';
import type { Battle, Neta } from '@/types/types';
import { uid } from '@/lib/id';

/**
 * ExampleBattleReportRepository
 * @public
 * A sample repository that demonstrates how to produce a Battle entity.
 */
export class ExampleBattleReportRepository implements BattleReportRepository {
    /**
     * Generate or fetch a battle report.
     * @param options Optional signal for cancellation.
     * @returns A fully-populated Battle entity.
     */
    async generateReport(options?: { signal?: AbortSignal }): Promise<Battle> {
        // touch options to satisfy lint until real use is added
        void options?.signal;
        const makeNeta = (title: string): Neta => ({
            title,
            subtitle: 'Example Subtitle',
            description: 'Generated by ExampleRepo',
            imageUrl: 'about:blank',
            power: 42,
        });
        return {
            id: uid('battle'),
            title: 'Example Battle',
            subtitle: 'Showcase',
            overview: 'An example implementation for Battle reports',
            scenario: 'Two sides face off in a demonstration scenario.',
            yono: makeNeta('Yono - Example'),
            komae: makeNeta('Komae - Example'),
            status: 'success',
        };
    }
}

/**
 * ExampleJudgementRepository
 * @public
 * Demonstrates a simple rule for determining the winner.
 */
export class ExampleJudgementRepository implements JudgementRepository {
    /**
     * Decide the winner based on provided input.
     * @param input Includes the current mode and the two combatants.
     * @param options Optional signal for cancellation.
     * @returns A Verdict containing the winner and decision metadata.
     */
    async determineWinner(
        input: { mode: { id: string }; yono: Neta; komae: Neta },
        options?: { signal?: AbortSignal },
    ): Promise<Verdict> {
        void options?.signal;
        const powerDiff = input.yono.power - input.komae.power;
        const winner =
            powerDiff === 0 ? 'DRAW' : powerDiff > 0 ? 'YONO' : 'KOMAE';
        return { winner, reason: 'power', powerDiff };
    }
}
```

1. 既存モードに ExampleRepo を配線

- ファイル: `src/yk/repo/core/repository-provider.ts`
- `mode.id` が対象モード(例: `demo`)に一致する場合、`ExampleBattleReportRepository` と `ExampleJudgementRepository` を返す分岐を追加します。

1. (任意) モードごとのデフォルト遅延を調整

- ヘルパ `defaultDelayForMode` を調整し、モード/リポジトリ種別に応じた現実的なレイテンシを模擬します。

1. 実装近傍にテストを追加

- ファイル: `src/yk/repo/example/repositories.example.test.ts`
- タイマー/乱数は必要に応じてモックし、ランダム値ではなく状態や相互作用を検証します。

### 新しい Play Mode とその Repository を追加する

新しい `ExampleMode` と新しいリポジトリ群を導入する場合の手順です。

1. Play Mode を登録

- ファイル: `src/yk/play-mode.ts`
- `playMode` に項目を追加:

```ts
// @ts-nocheck
// Adjust the type to your project definition
type PlayMode = {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
};
export const exampleMode: PlayMode = {
    id: 'example-mode',
    title: 'EXAMPLE MODE',
    description: 'A new mode powered by ExampleRepo',
    enabled: true,
};
```

1. Repository を実装

- 位置: `src/yk/repo/example/repositories.example.ts`(上記と同じ。必要であれば分割)

1. プロバイダファクトリにモード配線を追加

- ファイル: `src/yk/repo/core/repository-provider.ts`
- `getBattleReportRepository` と `getJudgementRepository` に分岐を追加:

```ts
if (mode?.id === 'example-mode') {
    const { ExampleBattleReportRepository } = await import(
        '@/yk/repo/example/repositories.example'
    );
    return new ExampleBattleReportRepository();
}
// ...
if (mode?.id === 'example-mode') {
    const { ExampleJudgementRepository } = await import(
        '@/yk/repo/example/repositories.example'
    );
    return new ExampleJudgementRepository();
}
```

1. UI またはテストでモードを選択

- ルートで `RepositoryProvider` に `mode={theExampleMode}` を渡す、または明示 DI を受け取るフック/コンポーネントへ `mode` を渡します。

1. 非同期初期化(ある場合)

- ExampleRepo が非同期セットアップ(API ウォームアップやメタデータ取得)を必要とする場合、`RepositoryProviderSuspense` と `<Suspense>` を使ってアプリシェルでラップします。

### Provider ファクトリでの配線

- プロバイダファクトリは `src/yk/repo/core/repository-provider.ts` にあります。
- `mode.id` ごとに適切な実装をインスタンス化する分岐を追加します。
- ファクトリは軽量で副作用を避け、可能な限り動的 import を利用してください。

### アプリでの Provider 利用(Suspense)

基本のプロバイダ(同期または遅延作成):

```tsx
import React from 'react';
import { RepositoryProvider } from '@/yk/repo/core/RepositoryProvider';
import { playMode, type PlayMode } from '@/yk/play-mode';

export function Root() {
    const [mode] = React.useState<PlayMode>(playMode[0]);
    return <RepositoryProvider mode={mode}>{/* App */}</RepositoryProvider>;
}
```

Suspense 対応プロバイダ(非同期初期化):

```tsx
import React, { Suspense } from 'react';
import { RepositoryProviderSuspense } from '@/yk/repo/core/RepositoryProvider';
import type { PlayMode } from '@/yk/play-mode';

export function Root({ mode }: { mode: PlayMode }) {
    return (
        <Suspense fallback={<div>Initializing…</div>}>
            <RepositoryProviderSuspense mode={mode}>
                {/* App */}
            </RepositoryProviderSuspense>
        </Suspense>
    );
}
```

### テストヘルパと Tips

テストガイドは [TESTING.md](./TESTING.md) を参照してください。

## End-to-End(E2E) テスト方針

E2E は Playwright を用いて、主要ユーザーフローとアクセシビリティ表面をカバーします。テストは速く、決定的で、ユーザーが体験する振る舞いに集中させます。

原則

- スコープ: spec は `e2e/` 配下に配置し、タスク指向を保つ。
- ロケータ: `getByRole(..., { name })` を優先。セマンティクスがないコンテナ(例: `battle`、`slot-yono`、`slot-komae`)にのみ `data-testid` を使用。脆い CSS/XPath は避ける。
- 決定性: 恣意的な待機は避け、`expect(...).toHave*` に依存。`prefers-reduced-motion` を尊重し、必要に応じてテストでエミュレート。
- パフォーマンス: 長時間/高回数フローは slow マークと `@performance` タグを付け、個別にフィルタ可能にする。
- アクセシビリティ: 重要なコントロールの role とアクセシブルネームを検証。

アノテーションとタグ

- タグは Playwright で grep 可能(例: `@performance`、`@a11y`、`@smoke`)。
- レポート注記が有用なら次を追加: `test.info().annotations.push({ type: 'performance', description: '...' })`。
- 参考: [Playwright Annotations](https://playwright.dev/docs/test-annotations)

例

```ts
import { test } from '@playwright/test';

test(
    'appends up to 100 battle containers when Battle is clicked repeatedly',
    {
        tag: ['@performance', '@slow'],
    },
    async ({ page }) => {
        // ... test body ...
    },
);

test('a long-running performance check', async ({ page }) => {
    test.slow();
    test.info().annotations.push({
        type: 'performance',
        description: 'Clicks Battle 100 times and verifies 100 containers',
    });
    // ... test body ...
});
```

### 受け入れチェックリスト

- TypeScript のコンパイルで新しいエラーがない。

## 移行ノート: Winner -> Verdict(破壊的変更)

2025-09-02 時点で、`JudgementRepository.determineWinner` は `Winner` 文字列ではなく、構造化された `Verdict` を返すようになりました。これは破壊的変更です。

- 旧: `Promise<Winner>`(`Winner = 'YONO' | 'KOMAE' | 'DRAW'`)
- 新: `Promise<Verdict>` の形:

```ts
type Verdict = {
    winner: 'YONO' | 'KOMAE' | 'DRAW';
    reason: 'bias-hit' | 'power' | 'api' | 'default' | 'near-tie';
    judgeCode?: string;
    rng?: number;
    powerDiff?: number; // yono.power - komae.power
    confidence?: number; // 任意の将来拡張
};
```

更新が必要な点:

- 呼び出し側: 生の文字列ではなく `verdict.winner` を参照する。
- 実装: 少なくとも `winner` と妥当な `reason`(例: ローカル比較なら `'power'`)を含む `Verdict` を返す。
- テスト/モック: 期待値を `verdict.winner` に合わせ、必要に応じて `reason`/`powerDiff` を含めて検証する。
- API/MSW: `/battle/judgement` のペイロードを `Verdict` 形にする。

理由:

- UI/テレメトリ向けに有用な意思決定メタデータを保持できる。
- 将来の進化(信頼度やジャッジコードなど)を、さらなる破壊的変更なく拡張しやすい。
