import { describe, it, expect } from 'vitest';
import { getBattleReportRepository } from './repository-provider';
import type { PlayMode } from '@/yk/play-mode';

const heMode: PlayMode = {
  id: 'historical-evidences',
  title: 'HISTORICAL EVIDENCES',
  description: '',
  enabled: true,
};

describe('historical-evidences mode repository', () => {
  it('returns the file-based repo and loads the requested battle file', async () => {
    const repo = await getBattleReportRepository(heMode, 'demo.ts');
    const battle = await repo.generateReport();
    expect(battle.id).toBe('demo-battle-001');
    expect(battle.title).toBe('Demo Historical Battle');
    expect(battle.status).toBe('success');
  });
});
