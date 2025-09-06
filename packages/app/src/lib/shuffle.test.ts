import { describe, it, expect } from 'vitest';
import { shuffleArray, shuffleInPlace, shuffleArraySeeded } from './shuffle';

describe('shuffle utilities', () => {
  it('shuffleArray returns new array and does not mutate input', () => {
    const src = [1, 2, 3, 4, 5];
    const copy = shuffleArray(src);
    expect(copy).toHaveLength(src.length);
    // Ensure original unchanged
    expect(src).toEqual([1, 2, 3, 4, 5]);
    // At least one position likely changed (probabilistic; allow fallback)
    const changed = copy.some((v, i) => v !== src[i]);
    // If identical (rare), try again to avoid flaky failure
    if (!changed) {
      const another = shuffleArray(src);
      const changed2 = another.some((v, i) => v !== src[i]);
      expect(changed2).toBe(true);
    } else {
      expect(changed).toBe(true);
    }
  });

  it('shuffleInPlace mutates array', () => {
    const src = [1, 2, 3, 4, 5];
    shuffleInPlace(src, () => 0.1); // deterministic path
    expect(src).not.toEqual([1, 2, 3, 4, 5]);
  });

  it('shuffleArraySeeded is deterministic for same seed', () => {
    const src = Array.from({ length: 20 }, (_, i) => i);
    const a = shuffleArraySeeded(src, 12345);
    const b = shuffleArraySeeded(src, 12345);
    const c = shuffleArraySeeded(src, 54321);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });
});
