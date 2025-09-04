import type { Battle } from '@yonokomae/types';

// Yono vs Komae: socio-economic trajectories (Japanese version)
const battle = {
  id: 'yono-komae-socioeconomic-1920-2050-ja',
  themeId: 'finance',
  significance: 'medium',
  title: '社会経済の軌跡',
  subtitle: '1920-2050 の人口と産業の動向',
  narrative: {
    overview:
      'YONOとKOMAEについて、人口、産業、ガバナンス上の節目にわたる比較スナップショット。',
    scenario:
      'YONOは20世紀を通じて着実に人口が増加し、合併後の都市開発(2001)とサービス業中心(2020時点で第3次産業が8割超)により成長が加速した。KOMAEは農業や養蚕業といった農村的基盤から郊外都市へ転換し、1955-1975にかけて人口が約3.4倍と急増、その後は安定し、2020には第3次産業が優勢となった。これらは都市化の経路、インフラ、経済構造の違いを反映している。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'KOMAE',
    subtitle: '農村的基盤から郊外都市へ',
    description:
      '人口: 1920 5,595 -> 1970 50,000 -> 2000 78,000 -> 2020 82,000 -> 2050 45,000(推計)。1970に市制施行。2015-2020の人口増減率は+5.6%。産業(2020の就業): 第1次296、第2次5,045、第3次26,818。鉄道: 駅2、路線1。昭和期の経済は農業・養蚕が中心。',
    power: 55,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'YONO',
    subtitle: 'サービス業優位の都市成長',
    description:
      '人口: 1920 10,750 -> 1945 19,000 -> 1970 71,000 -> 1980 81,000 -> 2000 97,000 -> 2020 103,000 -> 2050 104,000(推計)。1928に繊維工業(松本産業など)が進出。2020時点では(よの連合国全体で)第3次産業の就業者が8割超。2001の合併(浦和・大宮)によりよの連合国となり、さいたま新都心の開発が成長を加速。鉄道: 駅4、路線3。地区別GDPは非公開。',
    power: 60,
  },
  provenance: [
    {
      label: 'Arakawa Crossing Council, Komae HQ',
      note: '1920-2050の人口系列、産業構成、鉄道数、ガバナンスに関する注記。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
