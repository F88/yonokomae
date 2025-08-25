import { describe, it, expect } from 'vitest';
import { Judge } from './judge';

describe('Judge', () => {
  describe('constructor', () => {
    it('should set the name when creating a new Judge', () => {
      const judge = new Judge('Judge Judy');
      expect(judge.name).toBe('Judge Judy');
    });

    it('should set different names for different instances', () => {
      const judge1 = new Judge('Judge John');
      const judge2 = new Judge('Judge Jane');

      expect(judge1.name).toBe('Judge John');
      expect(judge2.name).toBe('Judge Jane');
    });
  });

  describe('determineWinner', () => {
    const dummyNeta = (power: number) => ({
      power,
      imageUrl: '',
      title: '',
      subtitle: '',
      description: '',
    });
    it('should return "YONO" when yonoPower is greater than komaePower', async () => {
      const judge = new Judge('T');
      const result = await judge.determineWinner({
        yono: dummyNeta(100),
        komae: dummyNeta(50),
      });
      expect(result).toBe('YONO');
    });

    it('should return "KOMAE" when komaePower is greater than yonoPower', async () => {
      const judge = new Judge('T');
      const result = await judge.determineWinner({
        yono: dummyNeta(30),
        komae: dummyNeta(80),
      });
      expect(result).toBe('KOMAE');
    });

    it('should return "DRAW" when powers are equal', async () => {
      const judge = new Judge('T');
      const result = await judge.determineWinner({
        yono: dummyNeta(50),
        komae: dummyNeta(50),
      });
      expect(result).toBe('DRAW');
    });

    it('should handle edge case with zero powers', async () => {
      const judge = new Judge('T');
      const result = await judge.determineWinner({
        yono: dummyNeta(0),
        komae: dummyNeta(0),
      });
      expect(result).toBe('DRAW');
    });

    it('should handle edge case with negative powers', async () => {
      const judge = new Judge('T');
      const result1 = await judge.determineWinner({
        yono: dummyNeta(-10),
        komae: dummyNeta(-5),
      });
      expect(result1).toBe('KOMAE');

      const result2 = await judge.determineWinner({
        yono: dummyNeta(-5),
        komae: dummyNeta(-10),
      });
      expect(result2).toBe('YONO');

      const result3 = await judge.determineWinner({
        yono: dummyNeta(-5),
        komae: dummyNeta(-5),
      });
      expect(result3).toBe('DRAW');
    });

    it('should handle decimal powers', async () => {
      const judge = new Judge('T');
      const result1 = await judge.determineWinner({
        yono: dummyNeta(50.5),
        komae: dummyNeta(50.4),
      });
      expect(result1).toBe('YONO');

      const result2 = await judge.determineWinner({
        yono: dummyNeta(50.4),
        komae: dummyNeta(50.5),
      });
      expect(result2).toBe('KOMAE');

      const result3 = await judge.determineWinner({
        yono: dummyNeta(50.5),
        komae: dummyNeta(50.5),
      });
      expect(result3).toBe('DRAW');
    });

    it('should be an instance async method now', () => {
      const judge = new Judge('Test Judge');
      expect(typeof judge.determineWinner).toBe('function');
    });

    it('should work with maximum safe integer values', async () => {
      const judge = new Judge('T');
      const result1 = await judge.determineWinner({
        yono: dummyNeta(Number.MAX_SAFE_INTEGER),
        komae: dummyNeta(Number.MAX_SAFE_INTEGER - 1),
      });
      expect(result1).toBe('YONO');

      const result2 = await judge.determineWinner({
        yono: dummyNeta(Number.MAX_SAFE_INTEGER - 1),
        komae: dummyNeta(Number.MAX_SAFE_INTEGER),
      });
      expect(result2).toBe('KOMAE');

      const result3 = await judge.determineWinner({
        yono: dummyNeta(Number.MAX_SAFE_INTEGER),
        komae: dummyNeta(Number.MAX_SAFE_INTEGER),
      });
      expect(result3).toBe('DRAW');
    });
  });
});
