export type JudgementCollapseConfig = {
    enabled?: boolean;
    ttlMs?: number;
    maxSize?: number;
};
type RepoId = 'api' | 'fake' | string;
export declare function getJudgementCollapseConfigFor(repoId: RepoId): JudgementCollapseConfig;
export declare function setDefaultJudgementCollapseConfig(cfg: JudgementCollapseConfig): void;
export declare function setRepoJudgementCollapseConfig(repoId: RepoId, cfg: JudgementCollapseConfig): void;
export {};
