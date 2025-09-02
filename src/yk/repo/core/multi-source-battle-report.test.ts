import { describe, it, expect } from 'vitest';
import { MultiSourceBattleReportRepository } from './multi-source-battle-report';
import type { BattleReportRepository } from './repositories';
import type { Battle } from '@/types/types';

class StubRepo implements BattleReportRepository {
  private readonly src: 'local' | 'api';
  constructor(src: 'local' | 'api') {
    this.src = src;
  }
  async generateReport(): Promise<Battle> {
    return {
      id: `${this.src}-1`,
      title: `${this.src.toUpperCase()} title`,
      subtitle: '',
      overview: '',
      scenario: '',
      komae: {
        imageUrl: '',
        title: 'K',
        subtitle: '',
        description: '',
        power: 10,
      },
      yono: {
        imageUrl: '',
        title: 'Y',
        subtitle: '',
        description: '',
        power: 10,
      },
      status: 'success',
    } satisfies Battle;
  }
}

describe('MultiSourceBattleReportRepository', () => {
  it('selects local when rng >= weightApi', async () => {
    const repo = new MultiSourceBattleReportRepository({
      local: new StubRepo('local'),
      api: new StubRepo('api'),
      weightApi: 0.3,
      rng: () => 0.4, // 0.4 >= 0.3 -> local
    });
    const b = await repo.generateReport();
    expect(b.id).toBe('local-1');
  });

  it('selects api when rng < weightApi', async () => {
    const repo = new MultiSourceBattleReportRepository({
      local: new StubRepo('local'),
      api: new StubRepo('api'),
      weightApi: 0.7,
      rng: () => 0.6, // 0.6 < 0.7 -> api
    });
    const b = await repo.generateReport();
    expect(b.id).toBe('api-1');
  });
});
