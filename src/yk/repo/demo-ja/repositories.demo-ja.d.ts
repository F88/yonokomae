import type {
  BattleReportRepository,
  JudgementRepository,
  Winner,
  PlayMode,
} from '@/yk/repo/core/repositories';
import type { Battle } from '@/types/types';
import { type DelayOption } from '../core/delay-utils';
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
export declare class DemoJaBattleReportRepository
  implements BattleReportRepository
{
  private delay?;
  constructor(options?: { delay?: DelayOption });
  generateReport(options?: { signal?: AbortSignal }): Promise<Battle>;
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
export declare class DemoJaJudgementRepository implements JudgementRepository {
  private delay?;
  constructor(options?: { delay?: DelayOption });
  determineWinner(
    input: {
      battle: Battle;
      mode: PlayMode;
      extra?: Record<string, unknown>;
    },
    options?: {
      signal?: AbortSignal;
    },
  ): Promise<Winner>;
}
