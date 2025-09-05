import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { uid } from './id';

describe('id utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('uid', () => {
    it('should generate unique IDs with default prefix', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));

      const id1 = uid();
      const id2 = uid();

      expect(id1).toMatch(/^id-[a-z0-9]+-\d+$/);
      expect(id2).toMatch(/^id-[a-z0-9]+-\d+$/);
      expect(id1).not.toBe(id2);
    });

    it('should use custom prefix', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));

      const id = uid('custom');

      expect(id).toMatch(/^custom-[a-z0-9]+-\d+$/);
      expect(id.startsWith('custom-')).toBe(true);
    });

    it('should increment counter for uniqueness', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));

      const id1 = uid('test');
      const id2 = uid('test');
      const id3 = uid('test');

      const [, , counter1] = id1.split('-');
      const [, , counter2] = id2.split('-');
      const [, , counter3] = id3.split('-');

      expect(parseInt(counter2)).toBe(parseInt(counter1) + 1);
      expect(parseInt(counter3)).toBe(parseInt(counter2) + 1);
    });

    it('should include timestamp in base36', async () => {
      const testTime = new Date('2024-01-01T12:34:56.789Z');
      vi.setSystemTime(testTime);

      // Reset module to reset internal counter and ensure default prefix path
      vi.resetModules();
      const { uid: freshUid } = await import('./id');

      const id = freshUid();
      const timestamp = testTime.getTime().toString(36);

      expect(id).toContain(timestamp);
      expect(id.split('-')[1]).toBe(timestamp);
    });

    it('should handle empty string prefix', () => {
      const id = uid('');

      expect(id).toMatch(/^-[a-z0-9]+-\d+$/);
      expect(id.startsWith('-')).toBe(true);
    });

    it('should handle special characters in prefix', () => {
      const id = uid('test_component.item');

      expect(id.startsWith('test_component.item-')).toBe(true);
      expect(id).toMatch(/^test_component\.item-[a-z0-9]+-\d+$/);
    });

    it('should generate different IDs at different times', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      const id1 = uid();

      vi.setSystemTime(new Date('2024-01-01T00:00:01.000Z'));
      const id2 = uid();

      expect(id1).not.toBe(id2);

      // Timestamps should be different
      const timestamp1 = id1.split('-')[1];
      const timestamp2 = id2.split('-')[1];
      expect(timestamp1).not.toBe(timestamp2);
    });

    it('should maintain counter across different prefixes', () => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));

      const id1 = uid('prefix1');
      const id2 = uid('prefix2');

      const counter1 = parseInt(id1.split('-')[2]);
      const counter2 = parseInt(id2.split('-')[2]);

      expect(counter2).toBe(counter1 + 1);
    });

    it('should work with undefined prefix (uses default)', () => {
      const id = uid(undefined);

      expect(id).toMatch(/^id-[a-z0-9]+-\d+$/);
    });

    it('should generate valid HTML IDs', () => {
      const id1 = uid('component');
      const id2 = uid('modal');
      const id3 = uid('button');

      // Valid HTML ID pattern (starts with letter/underscore, contains letters/numbers/hyphens/underscores)
      const htmlIdPattern = /^[a-zA-Z_][\w-]*$/;

      expect(htmlIdPattern.test(id1)).toBe(true);
      expect(htmlIdPattern.test(id2)).toBe(true);
      expect(htmlIdPattern.test(id3)).toBe(true);
    });

    it('should be performant for multiple calls', () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        uid('perf-test');
      }

      const end = performance.now();
      const duration = end - start;

      // Should complete 1000 calls in reasonable time (< 100ms is generous)
      expect(duration).toBeLessThan(100);
    });

    it('should maintain uniqueness over large number of calls', () => {
      const ids = new Set<string>();
      const numCalls = 1000;

      for (let i = 0; i < numCalls; i++) {
        const id = uid('bulk');
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }

      expect(ids.size).toBe(numCalls);
    });

    it('should handle rapid successive calls', () => {
      // Multiple calls in the same millisecond should still be unique
      const id1 = uid('rapid');
      const id2 = uid('rapid');
      const id3 = uid('rapid');

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('should format timestamp consistently', async () => {
      const testTimes = [
        new Date('2020-01-01T00:00:00.000Z'),
        new Date('2024-12-31T23:59:59.999Z'),
        new Date('2025-06-15T12:30:45.123Z'),
      ];

      for (const testTime of testTimes) {
        vi.setSystemTime(testTime);
        vi.resetModules();
        const { uid: freshUid } = await import('./id');
        const id = freshUid();
        const expectedTimestamp = testTime.getTime().toString(36);
        expect(id.split('-')[1]).toBe(expectedTimestamp);
      }
    });
  });

  describe('Counter state management', () => {
    it('should persist counter across module reloads in same test', () => {
      const id1 = uid();
      const counter1 = parseInt(id1.split('-')[2]);

      const id2 = uid();
      const counter2 = parseInt(id2.split('-')[2]);

      expect(counter2).toBeGreaterThan(counter1);
    });
  });
});
