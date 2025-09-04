import type { HistoricalSeed } from '@yonokomae/types';

const seed = {
  id: 'bridge-skirmish-002-en',
  title: 'Skirmish at the Old Bridge',
  subtitle: 'A Brief but Pivotal Clash',
  overview: 'Compiled from local newsletters and diaries.',
  narrative: 'A sudden confrontation erupted near the bridge at dusk.',
  provenance: [
    {
      label: 'Town Newsletter (2003)',
      note: 'Issue 7, eyewitness column',
    },
    {
      label: 'Placeholder Images',
      url: 'https://placehold.co/',
      note: 'Temporary illustration assets',
    },
  ],
} satisfies HistoricalSeed;

export default seed;
