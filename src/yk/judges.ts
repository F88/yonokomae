import type { JudgeIdentity } from '@/yk/repo/core/repositories';

// Central registry of judges used by the app.
// Keep codeName short for UI labels, and use stable ids for caching.
export const JUDGES: readonly JudgeIdentity[] = [
  { id: 'O', name: 'Judge O', codeName: 'O' },
  { id: 'U', name: 'Judge U', codeName: 'U' },
  { id: 'S', name: 'Judge S', codeName: 'S' },
  { id: 'C', name: 'Judge C', codeName: 'C' },
  { id: 'KK', name: 'Judge KK', codeName: 'KK' },
];

export function findJudgeByCodeName(
  codeName: string,
): JudgeIdentity | undefined {
  return JUDGES.find((j) => j.codeName === codeName);
}
