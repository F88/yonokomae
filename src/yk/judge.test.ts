import { describe, it, expect } from 'vitest';
import { Judge } from './judge';
import { playMode } from './play-mode';

describe('Judge', () => {
  describe('constructor', () => {
    it('should set the name when creating a new Judge', () => {
      const judge = new Judge('Judge Judy', playMode[0]);
      expect(judge.name).toBe('Judge Judy');
    });

    it('should set different names for different instances', () => {
      const judge1 = new Judge('Judge John', playMode[0]);
      const judge2 = new Judge('Judge Jane', playMode[0]);

      expect(judge1.name).toBe('Judge John');
      expect(judge2.name).toBe('Judge Jane');
    });
  });

  describe('mode - demo ', () => {
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
      ) => ({
        id: 'test-battle',
        title: 't',
        subtitle: 't',
        overview: 'o',
        scenario: 's',
        yono: y,
        komae: k,
      });
      it('should return "YONO" when yonoPower is greater than komaePower', async () => {
        const judge = new Judge('T', playMode[0]);
        const battle = dummyBattle(dummyNeta(100), dummyNeta(50));
        const result = await judge.determineWinner({ battle });
        expect(result).toBe('YONO');
      });

      it('should return "KOMAE" when komaePower is greater than yonoPower', async () => {
        const judge = new Judge('T', playMode[0]);
        const battle = dummyBattle(dummyNeta(30), dummyNeta(80));
        const result = await judge.determineWinner({ battle });
        expect(result).toBe('KOMAE');
      });

      it('should return "DRAW" when powers are equal', async () => {
        const judge = new Judge('T', playMode[0]);
        const battle = dummyBattle(dummyNeta(50), dummyNeta(50));
        const result = await judge.determineWinner({ battle });
        expect(result).toBe('DRAW');
      });

      it('should handle edge case with zero powers', async () => {
        const judge = new Judge('T', playMode[0]);
        const battle = dummyBattle(dummyNeta(0), dummyNeta(0));
        const result = await judge.determineWinner({ battle });
        expect(result).toBe('DRAW');
      });

      it('should handle edge case with negative powers', async () => {
        const judge = new Judge('T', playMode[0]);
        const result1 = await judge.determineWinner({
          battle: dummyBattle(dummyNeta(-10), dummyNeta(-5)),
        });
        expect(result1).toBe('KOMAE');

        const result2 = await judge.determineWinner({
          battle: dummyBattle(dummyNeta(-5), dummyNeta(-10)),
        });
        expect(result2).toBe('YONO');

        const result3 = await judge.determineWinner({
          battle: dummyBattle(dummyNeta(-5), dummyNeta(-5)),
        });
        expect(result3).toBe('DRAW');
      });

      it('should handle decimal powers', async () => {
        const judge = new Judge('T', playMode[0]);
        const result1 = await judge.determineWinner({
          battle: dummyBattle(dummyNeta(50.5), dummyNeta(50.4)),
        });
        expect(result1).toBe('YONO');

        const result2 = await judge.determineWinner({
          battle: dummyBattle(dummyNeta(50.4), dummyNeta(50.5)),
        });
        expect(result2).toBe('KOMAE');

        const result3 = await judge.determineWinner({
          battle: dummyBattle(dummyNeta(50.5), dummyNeta(50.5)),
        });
        expect(result3).toBe('DRAW');
      });

      it('should be an instance async method now', () => {
        const judge = new Judge('Test Judge', playMode[0]);
        expect(typeof judge.determineWinner).toBe('function');
      });

      it('should work with maximum safe integer values', async () => {
        const judge = new Judge('T', playMode[0]);
        const result1 = await judge.determineWinner({
          battle: dummyBattle(
            dummyNeta(Number.MAX_SAFE_INTEGER),
            dummyNeta(Number.MAX_SAFE_INTEGER - 1),
          ),
        });
        expect(result1).toBe('YONO');

        const result2 = await judge.determineWinner({
          battle: dummyBattle(
            dummyNeta(Number.MAX_SAFE_INTEGER - 1),
            dummyNeta(Number.MAX_SAFE_INTEGER),
          ),
        });
        expect(result2).toBe('KOMAE');

        const result3 = await judge.determineWinner({
          battle: dummyBattle(
            dummyNeta(Number.MAX_SAFE_INTEGER),
            dummyNeta(Number.MAX_SAFE_INTEGER),
          ),
        });
        expect(result3).toBe('DRAW');
      });
    });
  });
});
