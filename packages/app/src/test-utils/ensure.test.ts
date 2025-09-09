import { describe, expect, it } from 'vitest';
import { ensureString } from './ensure';

describe('ensureString', () => {
  it('returns valid non-empty string', () => {
    const result = ensureString('hello', 'test value');
    expect(result).toBe('hello');
  });

  it('throws error for empty string', () => {
    expect(() => ensureString('', 'test value')).toThrow('Expected test value to be a non-empty string');
  });

  it('throws error for undefined', () => {
    expect(() => ensureString(undefined, 'test value')).toThrow('Expected test value to be a non-empty string');
  });

  it('uses custom label in error message', () => {
    expect(() => ensureString('', 'custom label')).toThrow('Expected custom label to be a non-empty string');
  });

  it('returns single character string', () => {
    const result = ensureString('a', 'single char');
    expect(result).toBe('a');
  });
});