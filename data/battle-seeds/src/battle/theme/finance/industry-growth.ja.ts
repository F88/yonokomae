import type { Battle } from '@yonokomae/types';

// Yono vs Komae: industry and growth (Japanese version)
const battle = {
  id: 'industry-growth-1928-2025-ja',
  publishState: 'published',
  themeId: 'finance',
  significance: 'medium',
  title: '産業と成長パターン',
  subtitle: '繊維・農業からサービス経済へ',
  narrative: {
    overview:
      '産業構成と成長ドライバー。YONOは2020時点で第3次産業が8割超へシフト。KOMAEは昭和期の農業・養蚕から2020には郊外型サービス経済へ移行。',
    scenario:
      'YONOでは1928に繊維工業が拡大(松本産業など)。' +
      '2020には(よの連合国全体で)第3次産業の就業者が8割超で、2001の合併/さいたま新都心開発と整合的。' +
      'KOMAEは昭和期に農業・養蚕が中心で、2020の就業構成は第1次296、第2次5,045、第3次26,818。' +
      '鉄道/路線(YONO: 駅4/路線3、KOMAE: 駅2/路線1)は接続規模の差を示す。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'KOMAEの産業',
    subtitle: '畑からサービスへ',
    description:
      '昭和期の農業・養蚕の基盤。2020の就業: 第1次296、第2次5,045、第3次26,818。2015-2020の人口増減+5.6%(東京都内で高水準)。鉄道: 駅2、路線1。1955-1975の高度成長期に急増し、1970に市制施行。',
    power: 54,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'YONOの産業',
    subtitle: '都市サービスの集中',
    description:
      '1928の繊維工業拡大。2020には(よの連合国全体で)第3次産業が8割超。2001以降のさいたま新都心開発が成長を加速。鉄道: 駅4、路線3。地区別GDPは非公開。',
    power: 59,
  },
  provenance: [
    {
      label: 'Arakawa Crossing Council, Komae HQ',
      note: '産業構成(2020)、歴史的注記(1928の繊維/昭和期の農業・養蚕)、鉄道数、成長シグナル。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
