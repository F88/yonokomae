import type {
  BattleReportRepository,
  JudgementRepository,
  Winner,
  PlayMode,
} from '@/yk/repo/core/repositories';
import type { Battle } from '@/types/types';
import { type DelayOption } from '../core/delay-utils';
/**
 * DemoBattleReportRepository
 *
 * **Purpose**: Demonstration implementation with predefined battle scenarios for showcasing features.
 *
 * **Data Source**:
 * - Uses hardcoded, curated battle data for consistent demo experiences
 * - Generates fixed battle scenarios with predetermined outcomes
 * - Creates stable, reproducible battles for presentations and testing
 *
 * **Features**:
 * - Deterministic battle generation for reliable demos
 * - Showcases typical Yono vs Komae battle structure
 * - Hardcoded power levels and battle narratives
 * - No external dependencies or randomization
 * - Supports AbortSignal for cancellation
 *
 * **Use Cases**:
 * - Product demonstrations and presentations
 * - User interface testing with known data
 * - Feature showcase scenarios
 * - Integration testing with predictable outcomes
 *
 * **Battle Structure**:
 * - Fixed battle ID and timestamp
 * - Predefined character powers and descriptions
 * - Consistent narrative elements
 * - Stable provenance information
 *
 * **Dependencies**: None (self-contained)
 *
 * @see {@link BattleReportRepository} for interface definition
 */
export declare class DemoBattleReportRepository
  implements BattleReportRepository
{
  private delay?;
  constructor(options?: { delay?: DelayOption });
  generateReport(options?: { signal?: AbortSignal }): Promise<Battle>;
}
/**
 * DemoJudgementRepository
 *
 * A sample judgement implementation for DEMO. Adjust rules freely.
 */
export declare class DemoJudgementRepository implements JudgementRepository {
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
