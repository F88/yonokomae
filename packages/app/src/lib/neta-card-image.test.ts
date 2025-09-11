import { describe, expect, it } from 'vitest';
import type { NetaCardImage } from '@/lib/build-historical-scene-background';
import { mergeNetaCardImage } from '@/lib/neta-card-image';

const img = (url?: string, opacity?: number): NetaCardImage => ({
  imageUrl: url,
  opacity,
});

describe('mergeNetaCardImage', () => {
  it('prefers neta imageUrl when provided', () => {
    const base = img('/base.png', 0.7);
    const res = mergeNetaCardImage(base, '/neta.png');
    expect(res?.imageUrl).toBe('/neta.png');
    expect(res?.opacity).toBe(0.7);
  });

  it('falls back to base.imageUrl when neta image is empty', () => {
    const base = img('/base.png');
    const res = mergeNetaCardImage(base, '   ');
    expect(res?.imageUrl).toBe('/base.png');
  });

  it('returns undefined when neither url exists and base is undefined', () => {
    const res = mergeNetaCardImage(undefined, undefined);
    expect(res).toBeUndefined();
  });

  it('trims whitespace in both inputs', () => {
    const base = img('  /base.png  ');
    const res = mergeNetaCardImage(base, '   /neta.png   ');
    expect(res?.imageUrl).toBe('/neta.png');
  });
});
