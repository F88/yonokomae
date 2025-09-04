import { z } from 'zod';

/**
 * Zod schema for HistoricalSeed validation.
 */
export const HistoricalSeedSchema = z.object({
  /** Unique identifier for this historical seed */
  id: z.string().min(1),
  /** The main title of this historical event or evidence */
  title: z.string().min(1),
  /** A brief subtitle or tagline */
  subtitle: z.string(),
  /** A short overview of the historical context */
  overview: z.string(),
  /** Detailed narrative describing the historical evidence */
  narrative: z.string(),
  /** Array of provenance information citing sources */
  provenance: z
    .array(
      z.object({
        /** Label describing the source type */
        label: z.string().min(1),
        /** Optional URL to the source */
        url: z.string().url().optional(),
        /** Optional note about the source */
        note: z.string().optional(),
      }),
    )
    .optional(),
});

// Re-export type from z.infer for convenience
export type HistoricalSeed = z.infer<typeof HistoricalSeedSchema>;
