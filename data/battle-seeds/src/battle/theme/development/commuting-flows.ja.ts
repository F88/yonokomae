import type { Battle } from '@yonokomae/types';

// Yono vs Komae: commuting flows and mobility (Japanese version)
const battle = {
  id: 'commuting-flows-1995-2025-ja',
  publishState: 'published',
  themeId: 'development',
  significance: 'medium',
  title: '通勤流動と交流人口',
  subtitle: '1995-2025 のモビリティと都市圏のつながり',
  narrative: {
    overview:
      'YONO と KOMAE における通勤・通学・購買行動の流動を概観し、都市圏ネットワークの違いを示す。',
    scenario:
      'YONO は 2000 年代以降、都心・副都心への直結路線とバス網の強化で域外通勤が増加しつつ、' +
      '駅周辺の再開発により域内完結度も上昇。KOMAE は 私鉄沿線のベッドタウンとして域外通勤比率が高く、' +
      '駅近の商業利便性の向上で日常の購買行動は域内シフトが進行。双方ともにピーク分散・在宅比率の上昇により、' +
      '直近では朝夕ピークが緩和される傾向。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'KOMAE のモビリティ',
    subtitle: '沿線ベッドタウンの都心アクセス',
    description:
      '私鉄と幹線道路により都心・副都心への通勤が容易。日中は域内での買回り・近隣市への短距離移動が中心。' +
      '在宅勤務の普及でピーク時混雑はやや緩和。',
    power: 53,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'YONO のモビリティ',
    subtitle: '広域ハブと駅前再開発',
    description:
      '広域鉄道ネットワークとバス結節点の強化により、都心・副都心・県内主要拠点へのアクセスが向上。' +
      '駅前再開発による域内完結度の上昇で昼間人口が増加傾向。',
    power: 57,
  },
  provenance: [
    {
      label: 'Arakawa Crossing Council, Komae HQ',
      note: '通勤・通学・購買行動の傾向整理。推定を含む参考値。',
    },
    {
      label: '小田急線こまえ駅の朝の風景',
      note: '新宿方面へ向かう満員電車に乗り込む人々の列。',
    },
    {
      label: 'JRさいたま新都心駅の夕方の風景',
      note: '都心から帰宅する人々と、駅周辺の商業施設で楽しむ人々で賑わう。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
