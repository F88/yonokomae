import { describe, it, expect } from 'vitest';
import { Judge } from './judge';
import { playMode } from './play-mode';
import type { Battle } from '@yonokomae/types';

describe('Judge', () => {
  describe('constructor', () => {
    it('should set the name when creating a new Judge', () => {
      const judge = new Judge('id-1', 'Judge Judy', 'JUDY');
      expect(judge.name).toBe('Judge Judy');
    });

    it('should set different names for different instances', () => {
      const judge1 = new Judge('id-1', 'Judge John', 'JOHN');
      const judge2 = new Judge('id-2', 'Judge Jane', 'JANE');

      expect(judge1.name).toBe('Judge John');
      expect(judge2.name).toBe('Judge Jane');
    });
  });

  describe('mode - demo ', () => {
    const demoMode = playMode.find((m) => m.id === 'demo')!;
    describe('determineWinner', () => {
      const dummyNeta = (power: number) => ({
        power,
        imageUrl: '',
        title: '',
        subtitle: '',
        description: '',
      });
      const dummyBattle = (
        y: ReturnType<typeof dummyNeta>,
        k: ReturnType<typeof dummyNeta>,
      ): Battle => ({
        id: 'test-battle',
        themeId: 'history',
        significance: 'low',
        title: 't',
        subtitle: 't',
        narrative: { overview: 'o', scenario: 's' },
        yono: y,
        komae: k,
      });
      it('should return "YONO" when yonoPower is greater than komaePower', async () => {
        const judge = new Judge('id', 'T', 'T');
        const battle = dummyBattle(dummyNeta(100), dummyNeta(50));
        const result = await judge.determineWinner({
          battle,
          mode: demoMode,
        });
        expect(result.winner).toBe('YONO');
      });

      it('should return "KOMAE" when komaePower is greater than yonoPower', async () => {
        const judge = new Judge('id', 'T', 'T');
        const battle = dummyBattle(dummyNeta(30), dummyNeta(80));
        const result = await judge.determineWinner({
          battle,
          mode: demoMode,
        });
        expect(result.winner).toBe('KOMAE');
      });

      it('should return "DRAW" when powers are equal', async () => {
        const judge = new Judge('id', 'T', 'T');
        const battle = dummyBattle(dummyNeta(50), dummyNeta(50));
        const result = await judge.determineWinner({
          battle,
          mode: demoMode,
        });
        expect(result.winner).toBe('DRAW');
      });

      it('should handle edge case with zero powers', async () => {
        const judge = new Judge('id', 'T', 'T');
        const battle = dummyBattle(dummyNeta(0), dummyNeta(0));
        const result = await judge.determineWinner({
          battle,
          mode: demoMode,
        });
        expect(result.winner).toBe('DRAW');
      });

      it('should handle edge case with negative powers', async () => {
        const judge = new Judge('id', 'T', 'T');
        const resA = await judge.determineWinner({
          battle: dummyBattle(dummyNeta(-10), dummyNeta(-5)),
          mode: demoMode,
        });
        expect(resA.winner).toBe('KOMAE');

        const resB = await judge.determineWinner({
          battle: dummyBattle(dummyNeta(-5), dummyNeta(-10)),
          mode: demoMode,
        });
        expect(resB.winner).toBe('YONO');

        const resC = await judge.determineWinner({
          battle: dummyBattle(dummyNeta(-5), dummyNeta(-5)),
          mode: demoMode,
        });
        expect(resC.winner).toBe('DRAW');
      });

      it('should handle decimal powers', async () => {
        const judge = new Judge('id', 'T', 'T');
        const res1 = await judge.determineWinner({
          battle: dummyBattle(dummyNeta(50.5), dummyNeta(50.4)),
          mode: demoMode,
        });
        expect(res1.winner).toBe('YONO');

        const result2 = await judge.determineWinner({
          battle: dummyBattle(dummyNeta(50.4), dummyNeta(50.5)),
          mode: demoMode,
        });
        expect(result2.winner).toBe('KOMAE');

        const result3 = await judge.determineWinner({
          battle: dummyBattle(dummyNeta(50.5), dummyNeta(50.5)),
          mode: demoMode,
        });
        expect(result3.winner).toBe('DRAW');
      });

      it('should be an instance async method now', () => {
        const judge = new Judge('id', 'Test Judge', 'TEST');
        expect(typeof judge.determineWinner).toBe('function');
      });

      it('should work with maximum safe integer values', async () => {
        const judge = new Judge('id', 'T', 'T');
        const result1 = await judge.determineWinner({
          battle: dummyBattle(
            dummyNeta(Number.MAX_SAFE_INTEGER),
            dummyNeta(Number.MAX_SAFE_INTEGER - 1),
          ),
          mode: demoMode,
        });
        expect(result1.winner).toBe('YONO');

        const result2 = await judge.determineWinner({
          battle: dummyBattle(
            dummyNeta(Number.MAX_SAFE_INTEGER - 1),
            dummyNeta(Number.MAX_SAFE_INTEGER),
          ),
          mode: demoMode,
        });
        expect(result2.winner).toBe('KOMAE');

        const result3 = await judge.determineWinner({
          battle: dummyBattle(
            dummyNeta(Number.MAX_SAFE_INTEGER),
            dummyNeta(Number.MAX_SAFE_INTEGER),
          ),
          mode: demoMode,
        });
        expect(result3.winner).toBe('DRAW');
      });
    });
  });
});
