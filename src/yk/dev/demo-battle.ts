import type { Battle } from '@/types/types';

/**
 * Create a stable demo Battle object for development/design previews.
 * Not used in production flows unless explicitly enabled via flag.
 */
export function createDemoBattle(id: string): Battle {
  return {
    id,
    title: 'Demo: Komae vs Yono',
    subtitle: 'Design snapshot',
    overview:
      'A pre-baked battle report for development and design review. Toggle via VITE_DEMO_BATTLE or ?demo=1.',
    scenario:
      'On a calm evening, Komae and Yono met on the fields to compare strengths. Citizens gathered to watch a friendly contest. The wind favored neither side, and the results reflect a balanced exchange of tactics.',
    komae: {
      imageUrl:
        'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop',
      title: 'Komae the Brave',
      subtitle: 'Hero of the East',
      description:
        'Disciplined, inventive, and focused on sustainable advantages in logistics and morale.',
      power: 72,
    },
    yono: {
      imageUrl:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
      title: 'Yono the Mighty',
      subtitle: 'Defender of the West',
      description:
        'Swift, adaptable, and known for decisive maneuvers when opportunities arise.',
      power: 74,
    },
    status: 'success',
    provenance: [
      { label: 'Design note', note: 'Static demo content for previews.' },
    ],
  };
}
