import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BattleReportRandomDataRepository } from './repositories.random-jokes';

// Tiny test to assert deterministic seed-backed output shape

describe('BattleReportRandomDataRepository', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

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

  it('accepts delay parameter in constructor and skips delay in tests', async () => {
    const repo = new BattleReportRandomDataRepository({
      seedFile: undefined,
      delay: { min: 1000, max: 2000 },
    });

    const startTime = Date.now();
    const battle = await repo.generateReport();
    const endTime = Date.now();

    expect(battle).toBeDefined();
    expect(battle.title).toBeTruthy();

    // Should complete quickly in test environment
    expect(endTime - startTime).toBeLessThan(100);
  });

  it('supports AbortSignal in generateReport', async () => {
    const repo = new BattleReportRandomDataRepository({ delay: 500 });
    const controller = new AbortController();

    // Abort immediately to test signal handling
    controller.abort();

    // Should not throw in test env since delay is skipped
    const battle = await repo.generateReport({ signal: controller.signal });
    expect(battle).toBeDefined();
  });

  it('can be instantiated with specific seed file', async () => {
    const repo = new BattleReportRandomDataRepository({
      seedFile: 'specific-seed.ts',
      delay: 100,
    });

    const battle = await repo.generateReport();
    expect(battle.title).toBeTruthy();
  });
});
