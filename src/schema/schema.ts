import { z } from 'zod';

export const NetaSchema = z.object({
  imageUrl: z.string().min(1),
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  power: z.number(),
});

export const BattleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string(),
  overview: z.string(),
  scenario: z.string(),
  komae: NetaSchema,
  yono: NetaSchema,
  provenance: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url().optional(),
        note: z.string().optional(),
      }),
    )
    .optional(),
  status: z.enum(['loading', 'success', 'error']).optional(),
});
