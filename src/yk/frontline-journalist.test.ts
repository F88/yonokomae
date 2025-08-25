import { describe, it, expect, vi } from 'vitest';
import { FrontlineJournalist } from './frontline-journalist';
import { faker } from '@faker-js/faker';

vi.mock('@faker-js/faker', () => ({
  faker: {
    number: {
      int: vi.fn()
    }
  }
}));

describe('FrontlineJournalist', () => {
  describe('constructor', () => {
    it('should set the name when provided', () => {
      const journalist = new FrontlineJournalist('John Doe');
      expect(journalist.name).toBe('John Doe');
    });

    it('should set default name when not provided', () => {
      const journalist = new FrontlineJournalist();
      expect(journalist.name).toBe('no-name');
    });

    it('should set default name when empty string provided', () => {
      const journalist = new FrontlineJournalist('');
      expect(journalist.name).toBe('no-name');
    });
  });

  describe('report', () => {
    it("should generate a battle report with correct structure", () => {
      const journalist = new FrontlineJournalist("Reporter");

      vi.mocked(faker.number.int)
        .mockReturnValueOnce(85)
        .mockReturnValueOnce(72);

      const battle = journalist.report();

      expect(battle).toHaveProperty("title");
      expect(battle).toHaveProperty("subtitle");
      expect(battle).toHaveProperty("overview");
      expect(battle).toHaveProperty("scenario");
      expect(battle).toHaveProperty("komae");
      expect(battle).toHaveProperty("yono");
    });

    it("should generate a battle with correct default values", () => {
      const journalist = new FrontlineJournalist();

      vi.mocked(faker.number.int)
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(60);

      const battle = journalist.report();

      expect(battle.title).toBe("The Great Battle of 1945");
      expect(battle.subtitle).toBe("A Clash of Titans");
      expect(battle.overview).toBe(
        "An epic battle that changed the course of history."
      );
      expect(battle.scenario).toContain("In the final days of World War II");
    });

    it('should generate Komae with correct placeholder data and random power', () => {
      const journalist = new FrontlineJournalist();

      const expectedPower = 75;
      vi.mocked(faker.number.int)
        .mockReturnValueOnce(expectedPower)
        .mockReturnValueOnce(50);

      const battle = journalist.report();

      expect(battle.komae.imageUrl).toBe("https://placehold.co/200x100?text=K");
      expect(battle.komae.title).toBe("Komae the Brave");
      expect(battle.komae.subtitle).toBe("Hero of the East");
      expect(battle.komae.description).toBe("A placeholder for Komae. Replace with real data.");
      expect(battle.komae.power).toBe(expectedPower);
    });

    it('should generate Yono with correct placeholder data and random power', () => {
      const journalist = new FrontlineJournalist();

      const expectedPower = 90;
      vi.mocked(faker.number.int)
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(expectedPower);

      const battle = journalist.report();

      expect(battle.yono.imageUrl).toBe("https://placehold.co/200x100?text=Y");
      expect(battle.yono.title).toBe("Yono the Mighty");
      expect(battle.yono.subtitle).toBe("Defender of the West");
      expect(battle.yono.description).toBe("A placeholder for Yono. Replace with real data.");
      expect(battle.yono.power).toBe(expectedPower);
    });

    it("should call faker.number.int with correct parameters", () => {
      const journalist = new FrontlineJournalist();

      vi.mocked(faker.number.int).mockClear();
      vi.mocked(faker.number.int).mockReturnValue(50);

      journalist.report();

      expect(faker.number.int).toHaveBeenCalledTimes(2);
      expect(faker.number.int).toHaveBeenCalledWith({ min: 0, max: 100 });
    });

    it("should generate different power values for komae and yono", () => {
      const journalist = new FrontlineJournalist();

      vi.mocked(faker.number.int)
        .mockReturnValueOnce(30)
        .mockReturnValueOnce(80);

      const battle = journalist.report();

      expect(battle.komae.power).toBe(30);
      expect(battle.yono.power).toBe(80);
      expect(battle.komae.power).not.toBe(battle.yono.power);
    });
  });
});
