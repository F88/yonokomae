import type { Battle } from '@/types/types';

// Yono vs Komae: population trends (French version)
const battle = {
  id: 'yono-komae-population-trends-1920-2050-fr',
  title: 'Yono vs Komae : tendances démographiques',
  subtitle: 'Instantanés et projections (1920–2050)',
  overview:
    'Instantanés démographiques de 1920 à 2050 (projections incluses) pour Yono et Komae, montrant des trajectoires divergentes à long terme.',
  scenario:
    'Yono passe de 10 750 (1920) à 104 000 (2050 proj.), avec des hausses régulières via 1945 (19 000), 1970 (71 000), 1980 (81 000), 2000 (97 000) et 2020 (103 000). Komae monte de 5 595 (1920) à 70 000 (1980), se stabilise autour de 82 000 (2020), puis devrait baisser à 45 000 d’ici 2050. Ces trajectoires reflètent des différences d’urbanisation, d’infrastructures et de rôles régionaux.',
  komae: {
    imageUrl: 'about:blank',
    title: 'Population de Komae',
    subtitle: 'Hausse, plateau, baisse projetée',
    description:
      'Points clés : 1920 5 595 ; 1970 50 000 ; 1980 70 000 ; 2000 78 000 ; 2020 82 000 ; 2050 45 000 (proj.). Forte hausse concomitante à la municipalisation (1970) ; baisse notable à long terme projetée.',
    power: 52,
  },
  yono: {
    imageUrl: 'about:blank',
    title: 'Population de Yono',
    subtitle: 'Croissance constante sur un siècle',
    description:
      'Points clés : 1920 10 750 ; 1945 19 000 ; 1970 71 000 ; 1980 81 000 ; 2000 97 000 ; 2020 103 000 ; 2050 104 000 (proj.). Croissance soutenue, stabilisation autour de 100k.',
    power: 58,
  },
  provenance: [
    {
      label: 'Tableau comparatif fourni par l’utilisateur (2025-08-27)',
      note: 'Valeurs de population pour 1920, 1945, 1970, 1980, 2000, 2020 et les projections 2050 pour Yono et Komae.',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
