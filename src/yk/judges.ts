import type { JudgeIdentity } from '@/yk/repo/core/repositories';

// Central registry of judges used by the app.
// Keep codeName short for UI labels, and use stable ids for caching.
export const JUDGES: readonly JudgeIdentity[] = [
  { id: 'judge-O', name: 'Judge O', codeName: 'O' },
  { id: 'judge-U', name: 'Judge U', codeName: 'U' },
  { id: 'judge-S', name: 'Judge S', codeName: 'S' },
  { id: 'judge-C', name: 'Judge C', codeName: 'C' },
  { id: 'judge-K', name: 'Judge K', codeName: 'K' },
];

export function findJudgeByCodeName(
  codeName: string,
): JudgeIdentity | undefined {
  return JUDGES.find((j) => j.codeName === codeName);
}
