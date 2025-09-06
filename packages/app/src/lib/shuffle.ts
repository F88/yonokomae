/**
 * Fisher-Yates shuffle (non-mutating, defensive for noUncheckedIndexedAccess).
 * Returns a new shuffled copy of the input array.
 */
export function shuffleArray<T>(arr: readonly T[]): T[] {
  const a: T[] = arr.slice() as T[];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const vi = a[i];
    const vj = a[j];
    if (vi === undefined || vj === undefined) continue;
    a[i] = vj as T;
    a[j] = vi as T;
  }
  return a;
}

/** In-place Fisher-Yates shuffle. Mutates the provided array. */
export function shuffleInPlace<T>(
  arr: T[],
  rnd: () => number = Math.random,
): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const vi = arr[i];
    const vj = arr[j];
    if (vi === undefined || vj === undefined) continue;
    arr[i] = vj as T;
    arr[j] = vi as T;
  }
}

/** Deterministic PRNG (Mulberry32) to allow seedable shuffles in tests */
export function createSeededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seedable non-mutating shuffle for test reproducibility */
export function shuffleArraySeeded<T>(arr: readonly T[], seed: number): T[] {
  const rnd = createSeededRandom(seed);
  const a: T[] = arr.slice() as T[];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const vi = a[i];
    const vj = a[j];
    if (vi === undefined || vj === undefined) continue;
    a[i] = vj as T;
    a[j] = vi as T;
  }
  return a;
}
