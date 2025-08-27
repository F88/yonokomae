import type { Battle } from '@/types/types';

// Yono vs Komae: socio-economic trajectories (French version)
const battle = {
  id: 'yono-komae-socioeconomic-1920-2050-fr',
  title: 'Yono vs Komae : trajectoires socio-économiques',
  subtitle: 'Tendances de la population et de l’industrie 1920–2050',
  overview:
    'Instantané comparatif entre Yono et Komae couvrant la population, l’industrie et les jalons de gouvernance.',
  scenario:
    'Yono a connu une croissance démographique régulière au XXe siècle, accélérée après la fusion de 2001 et portée par une économie de services (>80% de tertiaire en 2020). Komae est passée de racines agricoles et de la sériciculture à une ville suburbaine, avec une forte hausse 1955–1975 (~3,4×), puis une stabilisation et une prédominance tertiaire en 2020. Ces trajectoires reflètent des chemins d’urbanisation, des infrastructures et des structures économiques différentes.',
  komae: {
    imageUrl: 'about:blank',
    title: 'Komae',
    subtitle: 'Des racines rurales à une ville suburbaine',
    description:
      'Population : 1920 5 595 → 1970 50 000 → 2000 78 000 → 2020 82 000 → 2050 45 000 (proj.). Ville depuis 1970. Variation 2015–2020 : +5,6%. Emploi (2020) : primaire 296, secondaire 5 045, tertiaire 26 818. Rail : 2 gares, 1 ligne. Économie historique centrée sur l’agriculture et la sériciculture (ère Shōwa).',
    power: 55,
  },
  yono: {
    imageUrl: 'about:blank',
    title: 'Yono',
    subtitle: 'Croissance urbaine à dominante de services',
    description:
      'Population : 1920 10 750 → 1945 19 000 → 1970 71 000 → 1980 81 000 → 2000 97 000 → 2020 103 000 → 2050 104 000 (proj.). Expansion du textile en 1928 (Matsumoto Sangyo, etc.) ; en 2020, >80% de l’emploi dans le tertiaire (Saitama). Fusion de 2001 (Urawa, Ōmiya) pour former la ville de Saitama, quartier Chūō ; le développement de Saitama Shintoshin a accéléré la croissance. Rail : 4 gares, 3 lignes. PIB par district non publié.',
    power: 60,
  },
  provenance: [
    {
      label: 'Tableau comparatif fourni par l’utilisateur (2025-08-27)',
      note: 'Séries démographiques (1920–2050), composition industrielle, nombre de gares/lignes et notes de gouvernance pour Yono et Komae.',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
