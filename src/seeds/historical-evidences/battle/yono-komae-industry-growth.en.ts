import type { Battle } from '@/types/types';

// Yono vs Komae: industry composition and economic growth signals.
const battle = {
  id: 'yono-komae-industry-growth-1928-2025',
  title: 'Industry and Growth Patterns',
  subtitle: 'From textiles and agriculture to service economies',
  overview:
    'Industry composition and growth drivers: Yono shifts toward service dominance (>80% tertiary by 2020), while Komae transitions from agriculture/sericulture to a suburban service economy by 2020.',
  scenario:
    'In Yono, textiles expanded by 1928 (Matsumoto Sangyo etc.), and by 2020 the broader Saitama economy shows >80% tertiary employment, aligning with urban service concentration and the 2001 merger/Saitama Shintoshin development. Komae, historically agricultural with sericulture in the Showa era, evolves into a suburban city; by 2020, employment is: primary 296, secondary 5,045, tertiary 26,818. Rail and route counts (Yono: 4 stations/3 lines; Komae: 2/1) underscore different connectivity scales.',
  komae: {
    imageUrl: 'about:blank',
    title: 'Industry',
    subtitle: 'From fields to services',
    description:
      'Showa era agriculture and sericulture roots. By 2020: primary 296, secondary 5,045, tertiary 26,818. 2015–2020 population change +5.6% (Tokyo area). Rail: 2 stations, 1 line. Cityhood 1970 during rapid growth (1955–1975).',
    power: 54,
  },
  yono: {
    imageUrl: 'about:blank',
    title: 'Industry',
    subtitle: 'Urban service concentration',
    description:
      '1928 textiles expansion; by 2020, the broader Saitama economy is >80% tertiary employment. Post-2001 Saitama Shintoshin development accelerated growth. Rail: 4 stations, 3 lines. District-level GDP figures unpublished.',
    power: 59,
  },
  provenance: [
    {
      label: 'User-supplied comparative table (2025-08-27)',
      note: 'Industry composition (2020), historical notes (1928 textiles; Showa-era agriculture/sericulture), rail counts, and growth signals.',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
