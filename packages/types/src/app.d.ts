import type { Battle } from './battle.js';
/**
 * Battle report that may be partially filled during generation.
 */
export type BattleReport = Partial<Battle> & {
    reporter?: string;
    reportDate?: string;
};
/**
 * Judge's comment on a battle outcome.
 */
export interface JudgesComment {
    judgeName: string;
    comment: string;
}
/**
 * Aggregated counters for battle reports (minimal set).
 *
 * This interface intentionally includes only the four basic counts needed
 * for the first iteration of the UI.
 *
 * @example
 * const metrics: BattleReportMetrics = {
 *   totalReports: 5,
 *   generatingCount: 2,
 *   generationSuccessCount: 2,
 *   generationErrorCount: 1,
 * };
 */
export interface BattleReportMetrics {
    /** Total number of items currently in the `reports` array. */
    totalReports: number;
    /** Number of reports currently generating data (status === 'loading'). */
    generatingCount: number;
    /** Number of reports successfully generated (status transitioned from 'loading' without error). */
    generationSuccessCount: number;
    /** Number of reports that ended in generation error (status === 'error'). */
    generationErrorCount: number;
}
