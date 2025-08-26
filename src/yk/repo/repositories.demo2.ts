import type {
  BattleReportRepository,
  JudgementRepository,
  Winner,
} from '@/yk/repo/repositories';
import type { Battle, Neta } from '@/types/types';
import { uid } from '@/lib/id';

/**
 * Demo2BattleReportRepository
 *
 * A sample variant repository for the DEMO-2 play mode.
 * Produces battles with a different flavor from the default fake implementation.
 */
export class Demo2BattleReportRepository implements BattleReportRepository {
  // Add fields in the future if you need configuration (e.g., delay)
  constructor() {}

  async generateReport(_opts?: { signal?: AbortSignal }): Promise<Battle> {
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
 * Demo2JudgementRepository
 *
 * A sample judgement implementation for DEMO-2. Adjust rules freely.
 */
export class Demo2JudgementRepository implements JudgementRepository {
  // Add fields in the future if you need configuration (e.g., delay)
  constructor() {}

  async determineWinner(input: {
    mode: { id: string };
    yono: Neta;
    komae: Neta;
  }): Promise<Winner> {
    if (input.yono.power === input.komae.power) return 'DRAW';
    return input.yono.power > input.komae.power ? 'YONO' : 'KOMAE';
  }
}
