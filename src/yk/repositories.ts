import type { Battle, Neta } from '@/types/types';
import type { PlayMode } from '@/yk/play-mode';

/** Winner result for a battle judgement */
export type Winner = 'YONO' | 'KOMAE' | 'DRAW';

/**
 * BattleReportRepository
 *
 * Responsibility: provide Battle entities (reports) from a data source
 * (e.g., faker/local seed, REST/GraphQL API, DB).
 *
 * This replaces the current FrontlineJournalist.report() output.
 */
export interface BattleReportRepository {
  /**
   * Generate or fetch a battle report.
   * Always returns a complete Battle with a stable id.
   */
  generateReport(): Promise<Battle>;
}

/**
 * JudgementRepository
 *
 * Responsibility: determine the winner given two Netas and a play mode.
 * The implementation can be pure (local rules) or remote (API).
 *
 * This replaces the current Judge.determineWinner() logic.
 */
export interface JudgementRepository {
  determineWinner(input: {
    mode: PlayMode;
    yono: Neta;
    komae: Neta;
  }): Promise<Winner>;
}

/**
 * ScenarioRepository
 *
 * Responsibility: supply narrative elements for a battle.
 */
export interface ScenarioRepository {
  generateTitle(): Promise<string>;
  generateSubtitle(): Promise<string>;
  generateOverview(): Promise<string>;
  generateNarrative(): Promise<string>;
}

/**
 * NetaRepository
 *
 * Responsibility: provide base profiles for Yono/Komae. Power is assigned by
 * the report generator, so this returns profile fields only.
 */
export interface NetaRepository {
  getKomaeBase(): Promise<Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>>;
  getYonoBase(): Promise<Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>>;
}

/**
 * Optional granular repos (future):
 * - IdProviderRepository: supply stable unique ids for Battle/Neta
 * - RandomProvider/Clock: provide randomness and timing for deterministic tests
 * These can be added when responsibilities grow.
 */
