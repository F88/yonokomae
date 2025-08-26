import type { Battle } from '@/types/types';

// Yono vs Komae: socio-economic comparative snapshot derived from user-provided reference.
const battle = {
  id: 'yono-komae-socioeconomic-1920-2050',
  title: 'Socio-economic Trajectories',
  subtitle: '1920–2050 population and industry trends',
  overview:
    'A comparative snapshot of Yono and Komae across population, industry, and governance milestones.',
  scenario:
    'Yono experienced steady population growth through the 20th century, later accelerating with post-merger urban development (2001) and a service-heavy economy (>80% tertiary by 2020). Komae transitioned from agricultural roots and sericulture to a suburban city, seeing a rapid population increase during 1955–1975 (~3.4x), then stabilizing, with tertiary sector dominance by 2020. These trajectories reflect differing urbanization paths, infrastructure, and economic structures.',
  komae: {
    imageUrl: 'about:blank',
    title: 'Komae',
    subtitle: 'Agricultural roots to suburban city',
    description:
      'Population: 1920 5,595 → 1970 50,000 → 2000 78,000 → 2020 82,000 → 2050 45,000 (proj). 1970 cityhood. 2015–2020 population change: +5.6%. Industry (2020 employment): primary 296, secondary 5,045, tertiary 26,818. Rail: 2 stations, 1 line. Historical economy centered on agriculture and sericulture in the Showa era.',
    power: 55,
  },
  yono: {
    imageUrl: 'about:blank',
    title: 'Yono',
    subtitle: 'Urban growth with service-dominant economy',
    description:
      'Population: 1920 10,750 → 1945 19,000 → 1970 71,000 → 1980 81,000 → 2000 97,000 → 2020 103,000 → 2050 104,000 (proj). 1928 textiles (Matsumoto Sangyo, etc.) expanded; by 2020, >80% of workers in tertiary industries (Saitama overall). 2001 merger (Urawa, Omiya) to Saitama City, becoming Chuo Ward; Saitama Shintoshin development accelerated growth. Rail: 4 stations, 3 lines. GDP by district unpublished.',
    power: 60,
  },
  provenance: [
    {
      label: 'User-supplied comparative table (2025-08-27)',
      note: 'Population series (1920–2050), industry composition, rail counts, and governance notes for Yono and Komae.',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
