import { describe, it, expect } from 'vitest';
import { HistoricalBattleReportRepository } from './repositories.historical';

// Tiny test to assert deterministic seed-backed output shape

describe('HistoricalBattleReportRepository', () => {
  it('returns a battle with provenance from seed', async () => {
    const repo = new HistoricalBattleReportRepository();
    const battle = await repo.generateReport();
    expect(battle.title).toBeTruthy();
    expect(Array.isArray(battle.provenance)).toBe(true);
    expect(battle.provenance && battle.provenance.length).toBeGreaterThan(0);
    // Powers are fixed in this minimal impl
    expect(battle.komae.power).toBe(50);
    expect(battle.yono.power).toBe(50);
  });
});
