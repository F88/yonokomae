export type JudgementCollapseConfig = {
  enabled?: boolean;
  ttlMs?: number;
  maxSize?: number;
};

type RepoId = 'api' | 'fake' | string;

// In-code configurable defaults. Prefer code config over env for per-repo tuning.
const defaults: JudgementCollapseConfig = {
  enabled: true,
  ttlMs: 60_000,
  maxSize: 100,
};

// Optional per-repo overrides. Extend keys as needed.
const perRepo: Record<RepoId, JudgementCollapseConfig | undefined> = {
  // Example: in-memory (fake) repo can use smaller TTL if heavy
  fake: { enabled: true, ttlMs: 20_000, maxSize: 100 },
  // API repo can keep longer TTL
  api: { enabled: true, ttlMs: 60_000, maxSize: 200 },
  // Historical research can be a bit shorter to reflect frequent data edits
  historical: { enabled: true, ttlMs: 30_000, maxSize: 150 },
};

export function getJudgementCollapseConfigFor(
  repoId: RepoId,
): JudgementCollapseConfig {
  // For now, ignore mode. If needed, add per-mode branching here.
  return { ...defaults, ...(perRepo[repoId] ?? {}) };
}

// Optional setters for runtime/tests
export function setDefaultJudgementCollapseConfig(
  cfg: JudgementCollapseConfig,
): void {
  Object.assign(defaults, cfg);
}

export function setRepoJudgementCollapseConfig(
  repoId: RepoId,
  cfg: JudgementCollapseConfig,
): void {
  perRepo[repoId] = { ...cfg };
}
