import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_commuter_destination',
  themeId: 'community',
  publishState: 'published',
  significance: 'medium',
  title: '通勤',
  subtitle: 'ベッドタウンの利便性 職住近接の理想',
  narrative: {
    overview:
      '東京都心への通勤者が多数を占める狛江市と、旧与野市域から大宮や浦和といった新市の中心部への通勤が主流となったさいたま市(旧与野市)。' +
      '市民の生活圏を巡る対立。',
    scenario:
      '与野市時代、市民の35.3%が東京都特別区部へ、13.4%が浦和市へ、9.1%が大宮市へ通勤していた。' +
      'これは、東京へのベッドタウンとしての性格と、県内中核都市への通勤という二つの側面があったことを示唆している。' +
      '一方、狛江市は、都心から電車で約20分という利便性を強みとし、東京のベッドタウンとしての役割を担い続けている。' +
      'これは、市民が都市の外部に職を求める生活モデルだ。' +
      'この戦いは、東京という外部の都市に依存しつつ独自の生活圏を築くモデルと、合併により広大な市域内で職住近接の可能性を模索するモデル、どちらがより良い生活の質をもたらすかを問うものだ。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '東京への通勤',
    subtitle: '都心から約20分の利便性',
    description:
      '小田急線で都心へのアクセスが良く、多くの市民が東京へ通勤する。' +
      'これは、大都市の利便性を享受しつつ、多摩川の自然豊かな郊外に住む、ベッドタウンとしての狛江市の役割を象徴している。',
    power: 82,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'さいたま市内の通勤',
    subtitle: '浦和・大宮への通勤圏',
    description:
      '与野市時代の通勤先は、東京だけでなく、浦和や大宮といった近隣都市への通勤者も多かった。' +
      '合併により、これらの地域は一つの行政体となり、市域内での職住近接の可能性が生まれた。',
    power: 84,
  },
  provenance: [
    {
      label: '狛江市',
      url: 'https://tama120.metro.tokyo.lg.jp/introduction/komaeshi.php',
      note: '狛江市 | 市町村紹介 | 多摩の魅力発信プロジェクト',
    },
    {
      label: 'さいたま市の都市概況と歴史について',
      url: 'https://zzfo.zhengzhou.gov.cn/yhcs/2342739.jhtml',
      note: '日本埼玉市 - 郑州市人民政府外事办公室',
    },
    {
      label: '埼玉県さいたま市',
      url: 'https://www.sumai1.com/useful/townranking/town_11100/',
      note: '埼玉県さいたま市｜自治体別住みよさランキング｜三菱ＵＦＪ不動産販売「住まい１」',
    },
    {
      label: '狛江市',
      url: 'https://www.sumai1.com/useful/townranking/town_13219/',
      note: '東京都狛江市｜自治体別住みよさランキング｜三菱ＵＦＪ不動産販売「住まい１」',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
