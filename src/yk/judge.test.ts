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
      imageUrl: "",
      title: "",
      subtitle: "",
      description: "",
    });
    it('should return "YONO wins!" when yonoPower is greater than komaePower', () => {
  const result = Judge.determineWinner({
    yono: dummyNeta(100),
    komae: dummyNeta(50),
  });
      expect(result).toBe('YONO wins!');
    });

    it('should return "KOMAE wins!" when komaePower is greater than yonoPower', () => {
  const result = Judge.determineWinner({
    yono: dummyNeta(30),
    komae: dummyNeta(80),
  });
      expect(result).toBe('KOMAE wins!');
    });

    it('should return "It\'s a tie!" when powers are equal', () => {
  const result = Judge.determineWinner({
    yono: dummyNeta(50),
    komae: dummyNeta(50),
  });
      expect(result).toBe("It's a tie!");
    });

    it('should handle edge case with zero powers', () => {
  const result = Judge.determineWinner({
    yono: dummyNeta(0),
    komae: dummyNeta(0),
  });
      expect(result).toBe("It's a tie!");
    });

    it('should handle edge case with negative powers', () => {
  const result1 = Judge.determineWinner({
    yono: dummyNeta(-10),
    komae: dummyNeta(-5),
  });
  expect(result1).toBe("KOMAE wins!");

  const result2 = Judge.determineWinner({
    yono: dummyNeta(-5),
    komae: dummyNeta(-10),
  });
  expect(result2).toBe("YONO wins!");

  const result3 = Judge.determineWinner({
    yono: dummyNeta(-5),
    komae: dummyNeta(-5),
  });
  expect(result3).toBe("It's a tie!");
    });

    it('should handle decimal powers', () => {
  const result1 = Judge.determineWinner({
    yono: dummyNeta(50.5),
    komae: dummyNeta(50.4),
  });
  expect(result1).toBe("YONO wins!");

  const result2 = Judge.determineWinner({
    yono: dummyNeta(50.4),
    komae: dummyNeta(50.5),
  });
  expect(result2).toBe("KOMAE wins!");

  const result3 = Judge.determineWinner({
    yono: dummyNeta(50.5),
    komae: dummyNeta(50.5),
  });
  expect(result3).toBe("It's a tie!");
    });

    it('should be a static method', () => {
      expect(Judge.determineWinner).toBeDefined();
      expect(typeof Judge.determineWinner).toBe('function');

      const judge = new Judge('Test Judge');
  expect("determineWinner" in judge).toBe(false);
    });

    it('should work with maximum safe integer values', () => {
  const result1 = Judge.determineWinner({
    yono: dummyNeta(Number.MAX_SAFE_INTEGER),
    komae: dummyNeta(Number.MAX_SAFE_INTEGER - 1),
  });
  expect(result1).toBe("YONO wins!");

  const result2 = Judge.determineWinner({
    yono: dummyNeta(Number.MAX_SAFE_INTEGER - 1),
    komae: dummyNeta(Number.MAX_SAFE_INTEGER),
  });
  expect(result2).toBe("KOMAE wins!");

  const result3 = Judge.determineWinner({
    yono: dummyNeta(Number.MAX_SAFE_INTEGER),
    komae: dummyNeta(Number.MAX_SAFE_INTEGER),
  });
  expect(result3).toBe("It's a tie!");
    });
  });
});
