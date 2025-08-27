import type {
  BattleReportRepository,
  JudgementRepository,
  Winner,
} from '@/yk/repo/core/repositories';
import type { Battle, Neta } from '@/types/types';
import { uid } from '@/lib/id';
import { applyDelay, type DelayOption } from '../core/delay-utils';

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
export class DemoBattleReportRepository implements BattleReportRepository {
  private delay?: DelayOption;

  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }

  async generateReport(options?: { signal?: AbortSignal }): Promise<Battle> {
    await applyDelay(this.delay, options?.signal);
    // NOTE: Replace with your own deterministic/randomized logic as needed.
    // This is a placeholder to be adapted when DEMO-2 is implemented.
    const makeNeta = (title: string): Neta => ({
      title,
      subtitle: 'Alternative Style',
      description: 'Demo-2 flavored neta',
      imageUrl: 'about:blank',
      power: Math.floor(Math.random() * 100),
    });

    return {
      id: uid('battle'),
      title: 'Demo-2 Battle',
      subtitle: 'Variant Showcase',
      overview: 'An alternative demo mode scenario',
      scenario: 'Two sides clash in a whimsical skirmish.',
      yono: makeNeta('Yono - D2'),
      komae: makeNeta('Komae - D2'),
      status: 'success',
    };
  }
}

/**
 * DemoJudgementRepository
 *
 * A sample judgement implementation for DEMO. Adjust rules freely.
 */
export class DemoJudgementRepository implements JudgementRepository {
  private delay?: DelayOption;

  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }

  async determineWinner(
    input: { mode: { id: string }; yono: Neta; komae: Neta },
    options?: { signal?: AbortSignal },
  ): Promise<Winner> {
    await applyDelay(this.delay, options?.signal);
    if (input.yono.power === input.komae.power) return 'DRAW';
    return input.yono.power > input.komae.power ? 'YONO' : 'KOMAE';
  }
}
