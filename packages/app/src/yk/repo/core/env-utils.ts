// filepath: packages/app/src/yk/repo/core/env-utils.ts
// Environment variable helpers (Vite + Node compatibility)
// Supported boolean string values (case-insensitive):
// true set: 1, true, yes, on
// false set: 0, false, no, off

function normalize(key: string): string {
  return key.trim();
}

function getEnvRecord(): Record<string, string | undefined> | undefined {
  try {
    return (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  } catch {
    return undefined;
  }
}

function parseBoolean(raw: string | undefined): boolean | undefined {
  if (!raw) return undefined;
  const v = raw.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(v)) return true;
  if (["0", "false", "no", "off"].includes(v)) return false;
  return undefined;
}

// Returns boolean or undefined (no default fallback logic)
export function readBooleanEnvOptional(key: string): boolean | undefined {
  const env = getEnvRecord();
  return parseBoolean(env?.[normalize(key)]);
}

// Returns boolean with provided default fallback
export function readBooleanEnv(key: string, defaultValue: boolean): boolean {
  const parsed = readBooleanEnvOptional(key);
  return parsed === undefined ? defaultValue : parsed;
}

// Generic accessor for raw env value (string | undefined)
export function getViteEnvVar(key: string): string | undefined {
  const env = getEnvRecord();
  return env?.[normalize(key)];
}
