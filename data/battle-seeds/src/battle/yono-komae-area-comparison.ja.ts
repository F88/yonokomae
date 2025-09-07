import type { Battle } from '@yonokomae/types';

// Yono (Saitama-shi Chuo-ku) vs Komae: area size comparison (Japanese)
const battle = {
  id: 'yono-komae-area-comparison-geo-2025-ja',
  themeId: 'development',
  significance: 'low',
  title: '面積',
  subtitle: 'よのとこまえの地理的スケール',
  narrative: {
    overview:
      'よのの面積は 8.39 km²、こまえは 6.39 km²。よのの方が約 2 km² 広い。' +
      'よのの面積は 8.29 km² で、政令指定都市移行時に一部が編入され現行の 8.39 km² となった。',
    scenario:
      '面積は都市の密度・サービス配置・公園や道路空間の余裕に影響しうるが、単独では都市力を決めない。' +
      'YONO(現・よの)は 8.39 km² とこまえ(6.39 km²)より広く、よの(8.29 km²)からの小幅な拡大が背景にある。' +
      'こまえは全国で 2 番目に面積が小さい市として知られ、緻密な市街と沿線の機能集積が特徴とされる。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'KOMAE の面積',
    subtitle: '6.39 km² (全国で 2 番目に小さい市)',
    description:
      'コンパクトな市域に住宅地と生活利便施設が凝縮。小規模ゆえの近接性と、沿線アクセスの良さが日常動線を支える。',
    power: 42,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'YONO(よの連合国よの) の面積',
    subtitle: '8.39 km² (よの主要部 + 編入による微増)',
    description:
      'よのは 8.29 km²。政令市移行時にさいたま新都心の一部が編入され、現行のよのは 8.39 km²。' +
      '市街地更新や拠点開発の余地が相対的に広い。',
    power: 42,
  },
  provenance: [
    {
      label: '高尾山測量クラブ',
      note: 'よの 8.39 km²、こまえ 6.39 km²、差約 2 km²。よのは 8.29 km² → 編入で 8.39 km²。こまえは全国 2 位の小面積。',
    },
    {
      label: 'こまえ市民のジョーク',
      note: '「うちの市は、本気出せば一日で歩いて一周できる」',
    },
    {
      label: 'よの都市開発課の内部資料',
      note: '「広大な土地を活かし、次世代のスマートシティを建設する」という計画概要。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
