import type { Battle } from '@/types/types';

// Yono vs Komae: population trends across 1920–2050 (projected).
const battle = {
  id: 'yono-komae-population-trends-1920-2050',
  title: 'Population Trends',
  subtitle: 'Census snapshots and projections (1920–2050)',
  overview:
    'Population snapshots for Yono and Komae from 1920 to 2050 (projections included), highlighting divergent long-run trajectories.',
  scenario:
    'Yono grows from 10,750 (1920) to 104,000 (2050 proj) with steady increases through 1945 (19,000), 1970 (71,000), 1980 (81,000), 2000 (97,000), and 2020 (103,000). Komae rises from 5,595 (1920) to 70,000 (1980), stabilizes near 82,000 (2020), then is projected to decline to 45,000 by 2050. These paths reflect differing urbanization, infrastructure, and regional roles.',
  komae: {
    imageUrl: 'about:blank',
    title: 'Komae Population',
    subtitle: 'Rise, plateau, and projected decline',
    description:
      'Key points: 1920 5,595; 1970 50,000; 1980 70,000; 2000 78,000; 2020 82,000; 2050 45,000 (proj). Cityhood in 1970 coincides with rapid growth; long-term projections suggest notable decline.',
    power: 52,
  },
  yono: {
    imageUrl: 'about:blank',
    title: 'Yono Population',
    subtitle: 'Steady century-long growth',
    description:
      'Key points: 1920 10,750; 1945 19,000; 1970 71,000; 1980 81,000; 2000 97,000; 2020 103,000; 2050 104,000 (proj). Sustained growth with post-war acceleration and stabilization at ~100k.',
    power: 58,
  },
  provenance: [
    {
      label: 'User-supplied comparative table (2025-08-27)',
      note: 'Population values for 1920, 1945, 1970, 1980, 2000, 2020, and 2050 projections for Yono and Komae.',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
