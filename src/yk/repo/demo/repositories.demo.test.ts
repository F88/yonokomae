import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  DemoBattleReportRepository,
  DemoJudgementRepository,
} from './repositories.demo';

describe('Demo repositories with delay support', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('DemoBattleReportRepository', () => {
    it('generates battle report without delay by default', async () => {
      const repo = new DemoBattleReportRepository();
      const startTime = Date.now();

      const battle = await repo.generateReport();
      const endTime = Date.now();

      expect(battle).toHaveProperty('id');
      expect(battle).toHaveProperty('title', 'Demo-2 Battle');
      expect(battle).toHaveProperty('subtitle', 'Variant Showcase');
      expect(battle.yono.title).toBe('Yono - D2');
      expect(battle.komae.title).toBe('Komae - D2');

      // Should complete quickly in test env
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('accepts delay parameter in constructor', async () => {
      const repo = new DemoBattleReportRepository({ delay: 1000 });

      const battle = await repo.generateReport();

      expect(battle.title).toBe('Demo-2 Battle');
      // In test env, delay should be skipped, so this should still be fast
    });

    it('supports AbortSignal in generateReport', async () => {
      const repo = new DemoBattleReportRepository({
        delay: { min: 100, max: 200 },
      });
      const controller = new AbortController();

      // Cancel immediately to test signal handling
      controller.abort();

      // Should not throw in test env since delay is skipped
      const battle = await repo.generateReport({ signal: controller.signal });
      expect(battle).toBeDefined();
    });

    it('generates random power values', async () => {
      const repo = new DemoBattleReportRepository();

      const battle1 = await repo.generateReport();
      const battle2 = await repo.generateReport();

      // Powers are random, so they might be different
      expect(battle1.yono.power).toBeGreaterThanOrEqual(0);
      expect(battle1.yono.power).toBeLessThanOrEqual(100);
      expect(battle1.komae.power).toBeGreaterThanOrEqual(0);
      expect(battle1.komae.power).toBeLessThanOrEqual(100);

      // Use battle2 to ensure it's not considered unused
      expect(battle2.yono.power).toBeGreaterThanOrEqual(0);
      expect(battle2.komae.power).toBeGreaterThanOrEqual(0);
    });
  });

  describe('DemoJudgementRepository', () => {
    it('determines winner based on power comparison', async () => {
      const repo = new DemoJudgementRepository();

      const winner = await repo.determineWinner({
        mode: { id: 'demo' },
        yono: {
          title: 'Y',
          subtitle: '',
          description: '',
          imageUrl: '',
          power: 80,
        },
        komae: {
          title: 'K',
          subtitle: '',
          description: '',
          imageUrl: '',
          power: 60,
        },
      });

      expect(winner).toBe('YONO');
    });

    it('returns DRAW when powers are equal', async () => {
      const repo = new DemoJudgementRepository({ delay: 500 });

      const winner = await repo.determineWinner({
        mode: { id: 'demo' },
        yono: {
          title: 'Y',
          subtitle: '',
          description: '',
          imageUrl: '',
          power: 75,
        },
        komae: {
          title: 'K',
          subtitle: '',
          description: '',
          imageUrl: '',
          power: 75,
        },
      });

      expect(winner).toBe('DRAW');
    });

    it('supports AbortSignal in determineWinner', async () => {
      const repo = new DemoJudgementRepository({
        delay: { min: 200, max: 400 },
      });
      const controller = new AbortController();

      controller.abort();

      // Should not throw in test env
      const winner = await repo.determineWinner(
        {
          mode: { id: 'demo' },
          yono: {
            title: 'Y',
            subtitle: '',
            description: '',
            imageUrl: '',
            power: 90,
          },
          komae: {
            title: 'K',
            subtitle: '',
            description: '',
            imageUrl: '',
            power: 70,
          },
        },
        { signal: controller.signal },
      );

      expect(winner).toBe('YONO');
    });
  });
});
