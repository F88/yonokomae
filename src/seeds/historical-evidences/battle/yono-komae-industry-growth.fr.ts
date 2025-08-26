import type { Battle } from '@/types/types';

// Yono vs Komae: industry and growth (French version)
const battle = {
  id: 'yono-komae-industry-growth-1928-2025-fr',
  title: 'Yono vs Komae : industrie et dynamiques de croissance',
  subtitle: 'Du textile et de l’agriculture vers des économies de services',
  overview:
    'Composition sectorielle et moteurs de croissance : Yono bascule vers une dominance des services (>80% tertiaire en 2020), Komae évolue d’une base agricole/séricicole vers une économie suburbaine de services d’ici 2020.',
  scenario:
    'À Yono, le textile s’est développé dès 1928 (Matsumoto Sangyo, etc.). En 2020, l’économie (Saitama) compte >80% d’emplois tertiaires, en phase avec la fusion de 2001 et le développement de Saitama Shintoshin. À Komae, historiquement agricole avec sériciculture (ère Shōwa), la ville devient suburbaine ; en 2020 : primaire 296, secondaire 5 045, tertiaire 26 818. Gares et lignes (Yono : 4/3 ; Komae : 2/1) illustrent des échelles de connectivité différentes.',
  komae: {
    imageUrl: 'about:blank',
    title: 'Industrie de Komae',
    subtitle: 'Des champs aux services',
    description:
      'Base agricole et séricicole (ère Shōwa). En 2020 : primaire 296, secondaire 5 045, tertiaire 26 818. Variation de population 2015–2020 : +5,6% (région de Tokyo). Rail : 2 gares, 1 ligne. Forte croissance 1955–1975 ; municipalisation en 1970.',
    power: 54,
  },
  yono: {
    imageUrl: 'about:blank',
    title: 'Industrie de Yono',
    subtitle: 'Concentration de services urbains',
    description:
      'Expansion du textile en 1928. En 2020, >80% d’emplois tertiaires (Saitama). Le développement de Saitama Shintoshin (post-2001) accélère la croissance. Rail : 4 gares, 3 lignes. PIB par district non publié.',
    power: 59,
  },
  provenance: [
    {
      label: 'Tableau comparatif fourni par l’utilisateur (2025-08-27)',
      note: 'Composition sectorielle (2020), notes historiques (textile 1928 ; agriculture/sériciculture), rail et signaux de croissance.',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
