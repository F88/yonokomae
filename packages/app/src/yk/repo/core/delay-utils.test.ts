import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { computeDelayMs, applyDelay, sleep } from './delay-utils';

describe('delay-utils', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.useFakeTimers();
  });

  afterEach(() => {
    warnSpy.mockRestore();
    vi.useRealTimers();
  });

  describe('computeDelayMs', () => {
    it('returns 0 when no option provided', () => {
      expect(computeDelayMs()).toBe(0);
      expect(computeDelayMs(undefined)).toBe(0);
    });

    it('handles single number values', () => {
      expect(computeDelayMs(1000)).toBe(1000);
      expect(computeDelayMs(0)).toBe(0);
      expect(computeDelayMs(-100)).toBe(0); // clamped to 0
    });

    it('caps single values at MAX_DELAY_MS and warns', () => {
      const result = computeDelayMs(8_000);
      expect(result).toBe(5_000);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Delay capped at 5000ms (requested: 8000ms)'),
      );
    });

    it('handles range values', () => {
      const result = computeDelayMs({ min: 100, max: 200 });
      expect(result).toBeGreaterThanOrEqual(100);
      expect(result).toBeLessThanOrEqual(200);
    });

    it('caps range values and warns when exceeding limit', () => {
      const result = computeDelayMs({ min: 3_000, max: 8_000 });
      expect(result).toBeGreaterThanOrEqual(3_000);
      expect(result).toBeLessThanOrEqual(5_000);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Delay range capped to <= 5000ms'),
      );
    });

    it('handles edge case where min equals max', () => {
      const result = computeDelayMs({ min: 500, max: 500 });
      expect(result).toBe(500);
    });
  });

  describe('sleep', () => {
    it('resolves after specified time', async () => {
      const sleepPromise = sleep(1000);

      // Fast-forward time
      vi.advanceTimersByTime(1000);

      await expect(sleepPromise).resolves.toBeUndefined();
    });

    it('rejects when signal is already aborted', async () => {
      const controller = new AbortController();
      controller.abort();

      await expect(sleep(1000, controller.signal)).rejects.toThrow('Aborted');
    });

    it('rejects when signal is aborted during sleep', async () => {
      const controller = new AbortController();
      const sleepPromise = sleep(2000, controller.signal);

      // Abort after 1 second
      vi.advanceTimersByTime(1000);
      controller.abort();

      await expect(sleepPromise).rejects.toThrow('Aborted');
    });
  });

  describe('applyDelay', () => {
    it('skips delay in test environment', async () => {
      const startTime = Date.now();
      await applyDelay(1000);
      const endTime = Date.now();

      // Should complete immediately in test env
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('applies no delay when option is undefined', async () => {
      const startTime = Date.now();
      await applyDelay(undefined);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(50);
    });

    it('applies no delay when computed delay is 0', async () => {
      const startTime = Date.now();
      await applyDelay(0);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(50);
    });
  });
});
