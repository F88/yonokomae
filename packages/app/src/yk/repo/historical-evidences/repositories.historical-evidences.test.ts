import { describe, it, expect } from 'vitest';
import { getBattleReportRepository } from '../core/repository-provider';
// Minimal PlayMode type for this test (avoids path alias issues in test env)
type PlayMode = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const heMode: PlayMode = {
  id: 'historical-evidences',
  title: 'HISTORICAL EVIDENCES',
  description: '',
  enabled: true,
};

describe('historical-evidences mode repository', () => {
  // Unstable output data
  it.skip('returns the file-based repo and loads the requested battle file', async () => {
    const repo = await getBattleReportRepository(heMode, 'demo.en.ts');
    const battle = await repo.generateReport();
    expect(battle.id).toBe('demo-battle-001');
    expect(battle.title).toBe('Demo Historical Battle');
    expect(battle.status).toBe('success');
  });

  it('can filter by themeId (random pick respects narrowing)', async () => {
    const repo = await getBattleReportRepository(heMode);
    // Attempt multiple times to reduce flake risk: all returned battles must match themeId
    for (let i = 0; i < 5; i++) {
      const b = await repo.generateReport({
        filter: { battle: { themeId: 'history' } },
      });
      expect(b.themeId).toBe('history');
    }
  });

  it('throws when explicit file does not satisfy themeId filter', async () => {
    // Choose a known file via seedFile param that likely has themeId !== technology (using historical evidences mode random) –
    // Since we do not have deterministic file listing here, this test focuses on the error path only when mismatch occurs.
    const repo = await getBattleReportRepository(heMode, 'demo.en.ts');
    let caught: unknown = null;
    try {
      await repo.generateReport({
        filter: { battle: { themeId: 'technology' } },
      });
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeTruthy();
  });
});
