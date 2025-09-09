import { z } from 'zod';
import type { BattleThemeId } from '@yonokomae/types';
import { battleThemeCatalog } from '@yonokomae/catalog';

/**
 * Zod schema for Neta entity validation.
 */
export const NetaSchema = z.object({
  /** The URL of the image representing the Neta */
  imageUrl: z.string().min(1),
  /** The main title or name of the Neta */
  title: z.string(),
  /** A short subtitle or catchphrase for the Neta */
  subtitle: z.string(),
  /** A detailed description of the Neta */
  description: z.string(),
  /** The numeric power value used for battle calculations */
  power: z.number(),
});

/**
 * Zod schema for Battle scenario validation.
 */
// Derive a typed enum from battleThemeCatalog ids for strong inference
const themeIdValues = battleThemeCatalog.map(
  (t) => t.id,
) as unknown as readonly [BattleThemeId, ...BattleThemeId[]];
export const BattleThemeIdSchema = z.enum(themeIdValues);

export const BattleSchema = z.object({
  /** Stable unique id for list keys and tracking */
  id: z.string().min(1),
  /** The theme id (catalog key) of the battle scenario */
  themeId: BattleThemeIdSchema,
  /** Significance level of the battle */
  significance: z.enum(['low', 'medium', 'high', 'legendary']),
  /** The main title of the battle scenario */
  title: z.string().min(1),
  /** A short subtitle for the scenario */
  subtitle: z.string(),
  /** Scenario copy grouped for cohesion */
  narrative: z.object({
    overview: z.string(),
    scenario: z.string(),
  }),
  /** The Neta entity representing Komae */
  komae: NetaSchema,
  /** The Neta entity representing Yono */
  yono: NetaSchema,
  /** Optional provenance/citations for historical evidence */
  provenance: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url().optional(),
        note: z.string().optional(),
      }),
    )
    .optional(),
  /** Optional status for UI flow control */
  status: z.enum(['loading', 'success', 'error']).optional(),
  /** Publishing lifecycle state (default: published) */
  publishState: z
    .enum(['draft', 'review', 'published', 'archived'])
    .default('draft'),
});

// Re-export types from z.infer for convenience
export type Neta = z.infer<typeof NetaSchema>;
export type Battle = z.infer<typeof BattleSchema>;
