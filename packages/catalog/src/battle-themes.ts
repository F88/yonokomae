import type { BattleTheme } from '@yonokomae/types';

/**
 * Canonical theme catalog for Battle.themeId. Keep ids stable.
 */
export const battleThemeCatalog = [
  {
    id: 'history',
    name: 'History',
    icon: '📜',
    subThemes:
      'Fabrication of Official Records vs. Transmission of Personal Memories',
    description:
      'Tension between official narratives and lived memories across time.',
    includedElements:
      'Historical revisionism, propaganda, oral history, monuments, folklore, ancient documents, timelines, diplomatic records',
  },
  {
    id: 'culture',
    name: 'Culture',
    icon: '🏯',
    subThemes: 'Metropolitan Art Projects vs. Grassroots Traditional Events',
    description:
      'Balance between top-down cultural projects and community traditions.',
    includedElements:
      'Artist support, public art, international film festivals, community halls, local festivals, traditional crafts, local cuisine, cultural property protection',
  },
  {
    id: 'community',
    name: 'Community',
    // icon: '🤝',
    icon: '🏘️',
    subThemes:
      'Integration of Online Communities vs. Maintenance of Real-World Bonds',
    description:
      'Negotiating digital cohesion with tangible, local social ties.',
    includedElements:
      'SNS, digital divide, public referendums, citizen movements, local events, volunteerism, mutual aid, local ties',
  },

  {
    id: 'development',
    name: 'Development',
    icon: '🏗️',
    subThemes:
      'Ultramodern High-Rise Development vs. Preservation of Low-Rise Housing',
    description:
      'Urban form: vertical expansion versus human-scale preservation.',
    includedElements:
      'Smart cities, traffic congestion, underground development, urban farms, water resource management, urban landscape, city planning, environmental conservation',
  },
  {
    id: 'economy',
    name: 'Economy',
    icon: '📈',
    subThemes:
      'Attraction of Large-Scale Investors vs. Promotion of Local Currency',
    description:
      'Capital inflows and growth versus local circulation and resilience.',
    includedElements:
      'Public works, infrastructure, taxes, debt, economic growth, investment, distribution, financial institutions, employment',
  },
  {
    id: 'figures',
    name: 'Figures',
    icon: '🦸',
    subThemes: "AI Mayor's Data Politics vs. Charismatic Human Leadership",
    description:
      'Leadership dynamics between algorithmic governance and human charisma.',
    includedElements:
      'Notable figures (in-game heroes), leaders, bureaucrats, citizens, AI, robots, speeches, elections, public opinion',
  },
  {
    id: 'information',
    name: 'Information',
    icon: '📡',
    subThemes:
      'Information Control & Censorship vs. Journalism Seeking the Truth',
    description:
      'Freedom of information versus control, manipulation, and security.',
    includedElements:
      'Fake news, cyber attacks, AI-driven information manipulation, propaganda, freedom of the press, whistleblowing, hackers, cryptography',
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '🤖',
    subThemes:
      'Military Technology Repurposed vs. Application to Civilian Life',
    description:
      'Dual-use innovations: from defense origins to civic applications.',
    includedElements:
      'Robotics, AI, drones, cybernetics, medical technology, security, new materials, energy, communication technology',
  },
] as const satisfies readonly BattleTheme[];

export type BattleThemeId = (typeof battleThemeCatalog)[number]['id'];
