/** Test-only helper to assert a value is a non-empty string. */
export function ensureString(v: string | undefined, label: string): string {
  if (typeof v === 'string' && v.length > 0) return v;
  throw new Error(`Expected ${label} to be a non-empty string`);
}
