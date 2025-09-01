import type {
  BattleReportRepository,
  JudgementRepository,
  Winner,
  PlayMode,
} from '@/yk/repo/core/repositories';
import type { Battle } from '@/types/types';
import { uid } from '@/lib/id';
import { applyDelay, type DelayOption } from '../core/delay-utils';

/**
 * DemoJaBattleReportRepository
 *
 * 日本語向けのデモ用リポジトリ（'demo' モード/ja）。
 *
 * - 返すデータ（タイトル、サブタイトル、ナラティブなど）は日本語。
 * - `src/seeds/random-data` の英語シードに着想しつつ、文面は日本語化。
 * - 他モードへの影響なく将来分岐できるよう、クラスを分離。
 *
 * @remarks
 * デモのためにウィットに富んだ明らかなジョーク文面を返します。文字種は規約
 * に準拠し、半角の数字・英字・記号を使用します。
 * このリポジトリが生成する文字列はすべて日本語です。
 *
 * @see {@link BattleReportRepository}
 */
export class DemoJaBattleReportRepository implements BattleReportRepository {
  private delay?: DelayOption;

  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }

  async generateReport(options?: { signal?: AbortSignal }): Promise<Battle> {
    await applyDelay(this.delay, options?.signal);
    const patterns: Battle[] = [
      {
        id: 'template-ja-1',
        title: '橋上ごっこバトル',
        subtitle: '拍手はカモメだけ',
        overview:
          '古橋の小競り合いの抜粋: 町のニュースと日記をミキサーにかけました。',
        scenario: '黄昏の橋の上、勇気と足元が同時に滑る。拍手はカモメだけ。',
        yono: {
          imageUrl: '/YONO-SYMBOL.png',
          title: '橋梁警備隊・夜間哨戒分隊',
          subtitle: '欄干にもたれ平衡維持、きしむ板を点検しながら',
          description:
            '脚注が口論、橋は無表情。勝者は翌朝の筋肉痛。提灯の灯と日直簿が本日の英雄。帳簿は泥の指紋で重厚となり、靴底は余白に注釈を書き込み、補給担当は在庫の抒情化に異議を唱える。',
          power: 57,
        },
        komae: {
          imageUrl: '/KOMAE-SYMBOL.png',
          title: '斥候小隊・橋詰め接近斜行班',
          subtitle: '足音は風任せ、視線は前へ、地図は少し湿気気味',
          description:
            '脚注が口論、橋は無表情。勝者は翌朝の筋肉痛。河風のせいか、チョークの線が少し波打つ。斥候の余談には逃げ足の速い蛙が記録され、後方は次回より詩情の少ない経路を検討と追記。',
          power: 53,
        },
      },
      {
        id: 'template-ja-2',
        title: '提灯作戦バトル',
        subtitle: '雰囲気が全会一致',
        overview:
          '提灯偵察の現場報告: 光は蛾と噂とついでに将軍まで呼び寄せた。',
        scenario:
          '柔らかな灯りで作戦会議は照明寄りに。雰囲気が全会一致で可決。',
        yono: {
          imageUrl: '/YONO-SYMBOL.png',
          title: '斥候小隊・前進要素（狭橋対応）',
          subtitle: '地図は袖、影は味方、靴底は泥と対話中',
          description:
            '戦術は薄暗く、情緒が圧勝。撤退理由: いい感じだったから。次回は厚手の靴下を要望。欄外には蛾へのマナー案が添えられ、士気係は風景優先の進軍規程案を起草。',
          power: 60,
        },
        komae: {
          imageUrl: '/KOMAE-SYMBOL.png',
          title: '通信中隊・提灯連絡分遣隊',
          subtitle: '旗と信号、時報は正確、提灯磨きは任意',
          description:
            '戦術は薄暗く、情緒が圧勝。撤退理由: いい感じだったから。月が明るすぎるので減光希望の伝令あり。議事録は眩しさ起因の勇敢さを追記し、星明かり互換の句読点も検討に付す。',
          power: 58,
        },
      },
      {
        id: 'template-ja-3',
        title: '急須バトル',
        subtitle: '蒸気による多数決',
        overview:
          '急須の睨み合い速報: 蒸気が戦場を制圧、クッキーが和平を仲介。',
        scenario: '士気は沸騰、作戦は抽出、結論は渋み。勝敗は砂糖の匙加減。',
        yono: {
          imageUrl: '/YONO-SYMBOL.png',
          title: '通信中隊・手旗班（薬缶監督付き）',
          subtitle: '湯気の向こうに手旗信号、薬缶の承認印つき',
          description:
            '旗印の代わりに湯気。指揮系統は湯のみ回しで合意形成。文鳥からの賛辞も記録。薬缶は脚注で年功序列を主張し、旗はティーブレイク交渉のため一瞬だけ組合化。',
          power: 49,
        },
        komae: {
          imageUrl: '/KOMAE-SYMBOL.png',
          title: '橋梁警備隊・板材点検班',
          subtitle: '板を叩いて渡る専門職、湯気の様子も逐次確認',
          description:
            '旗印の代わりに湯気。指揮系統は湯のみ回しで合意形成。議事録の注釈に「湯気多め」。巻末付録はコースターの推奨を掲げ、最終決裁印には「承認、ただし湿潤」とある。',
          power: 55,
        },
      },
    ];

    const pick: Battle = patterns[Math.floor(Math.random() * patterns.length)];

    return {
      id: uid('battle'),
      title: pick.title,
      subtitle: pick.subtitle,
      overview: pick.overview,
      scenario: pick.scenario,
      yono: pick.yono,
      komae: pick.komae,
      status: 'success',
    };
  }
}

/**
 * DemoJaJudgementRepository
 *
 * 日本語向けのデモ用リポジトリ（'demo' モード/ja）。
 *
 * - 判定結果など、英語ではなく日本語の文字列を返す想定。
 * - 他モードへの影響なく将来分岐できるよう、クラスを分離。
 *
 * @remarks
 * このリポジトリは 'demo-ja' モードに属し、日本語のデータを前提とします。
 */
export class DemoJaJudgementRepository implements JudgementRepository {
  private delay?: DelayOption;

  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }

  async determineWinner(
    input: { battle: Battle; mode: PlayMode; extra?: Record<string, unknown> },
    options?: { signal?: AbortSignal },
  ): Promise<Winner> {
    await applyDelay(this.delay, options?.signal);
    const { yono, komae } = input.battle;
    if (yono.power === komae.power) return 'DRAW';
    return yono.power > komae.power ? 'YONO' : 'KOMAE';
  }
}
