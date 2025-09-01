import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  DemoJaBattleReportRepository,
  DemoJaJudgementRepository,
} from './repositories.demo-ja';
import { playMode } from '@/yk/play-mode';

describe('Demo repositories with delay support', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('DemoJaBattleReportRepository', () => {
    it('generates battle report without delay by default', async () => {
      const repo = new DemoJaBattleReportRepository();
      const startTime = Date.now();

      const battle = await repo.generateReport();
      const endTime = Date.now();

      expect(battle).toHaveProperty('id');
      // Title/Subitle are dynamic per scenario in JA; just assert they are non-empty strings
      expect(typeof battle.title).toBe('string');
      expect(battle.title.length).toBeGreaterThan(0);
      expect(typeof battle.subtitle).toBe('string');
      expect(battle.subtitle.length).toBeGreaterThan(0);

      // Should complete quickly in test env
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('accepts delay parameter in constructor', async () => {
      const repo = new DemoJaBattleReportRepository({ delay: 1000 });

      const battle = await repo.generateReport();

      // Title is dynamic now; ensure it exists and is in Japanese-ish form (non-empty)
      expect(typeof battle.title).toBe('string');
      expect(battle.title.length).toBeGreaterThan(0);
      // In test env, delay should be skipped, so this should still be fast
    });

    it('supports AbortSignal in generateReport', async () => {
      const repo = new DemoJaBattleReportRepository({
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
      const repo = new DemoJaBattleReportRepository();

      const battle1 = await repo.generateReport();
      const battle2 = await repo.generateReport();
      // subtitles are randomized; ensure they are present
      expect(typeof battle1.subtitle).toBe('string');
      expect(battle1.subtitle.length).toBeGreaterThan(0);
      expect(typeof battle1.yono.subtitle).toBe('string');
      expect(battle1.yono.subtitle.length).toBeGreaterThan(0);
      expect(typeof battle1.komae.subtitle).toBe('string');
      expect(battle1.komae.subtitle.length).toBeGreaterThan(0);
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

  describe('DemoJaJudgementRepository', () => {
    it('determines winner based on power comparison', async () => {
      const repo = new DemoJaJudgementRepository();

      const battle = {
        id: 'b-1',
        title: 't',
        subtitle: 's',
        overview: 'o',
        scenario: 'sc',
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
      };

      const winner = await repo.determineWinner({
        battle,
        mode: playMode.find((m) => m.id === 'demo')!,
      });

      expect(winner).toBe('YONO');
    });

    it('returns DRAW when powers are equal', async () => {
      const repo = new DemoJaJudgementRepository({ delay: 500 });

      const battle = {
        id: 'b-2',
        title: 't',
        subtitle: 's',
        overview: 'o',
        scenario: 'sc',
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
      };

      const winner = await repo.determineWinner({
        battle,
        mode: playMode.find((m) => m.id === 'demo')!,
      });

      expect(winner).toBe('DRAW');
    });

    it('supports AbortSignal in determineWinner', async () => {
      const repo = new DemoJaJudgementRepository({
        delay: { min: 200, max: 400 },
      });
      const controller = new AbortController();

      controller.abort();

      // Should not throw in test env
      const battle = {
        id: 'b-3',
        title: 't',
        subtitle: 's',
        overview: 'o',
        scenario: 'sc',
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
      };

      const winner = await repo.determineWinner(
        { battle, mode: playMode.find((m) => m.id === 'demo')! },
        { signal: controller.signal },
      );

      expect(winner).toBe('YONO');
    });
  });
});
