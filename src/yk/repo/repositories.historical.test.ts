import { describe, it, expect } from 'vitest';
import { BattleReportRandomDataRepository } from './repositories.historical';

// Tiny test to assert deterministic seed-backed output shape

describe('BattleReportRandomDataRepository', () => {
  it('returns a battle with provenance from seed', async () => {
  const repo = new BattleReportRandomDataRepository();
    const battle = await repo.generateReport();
    expect(battle.title).toBeTruthy();
    expect(Array.isArray(battle.provenance)).toBe(true);
    expect(battle.provenance && battle.provenance.length).toBeGreaterThan(0);
    // Powers are fixed in this minimal impl
    expect(battle.komae.power).toBe(50);
    expect(battle.yono.power).toBe(50);
  });
});
