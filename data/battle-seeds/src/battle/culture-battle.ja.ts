import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'culture-battle',
  themeId: 'culture',
  significance: 'medium',
  title: '文化の創造と継承',
  subtitle: 'メトロポリタン・アートか、草の根の祭りか。文化の覇者は？',
  narrative: {
    overview:
      'よのは、最先端の芸術を招致し、こまえは、失われつつある伝統の祭りを復活させる。文化という無形資産を巡る、価値観のぶつかり合いが今、始まる。',
    scenario:
      'よのは、さいたま新都心という新たな都市を舞台に、世界的なアーティストを招聘した巨大なアート・プロジェクトを立ち上げた。これは、合併によって生まれた新たな文化を世界に発信し、よのの先進性と知性を証明する試みである。一方、こまえは、住民の手で古くからの伝統行事を復活させ、地域コミュニティの絆を再確認しようと奮闘する。巨大な予算と洗練されたデザインのよのか、それとも市民の熱意と歴史が織りなすこまえか。どちらが真に人々の心を豊かにし、未来へと文化を繋ぐことができるか、プレイヤーの評価が問われる。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '草の根の伝統行事',
    description:
      '失われつつある祭りを復活させ、市民の参加を促す。その情熱は、巨大な力に屈せず、自分たちの歴史と文化を守り抜こうとする、こまえの誇りそのものである。',
    power: 38000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: 'メトロポリタン・アート',
    description:
      '合併によって誕生した新たな文化を、世界へと発信するため、巨額の予算を投じたアート・プロジェクトを立ち上げる。その洗練された芸術は、よのの先進性と知性を証明するのだ。',
    power: 38000,
  },
  provenance: [
    {
      label: 'さいたま市',
      note: 'さいたま国際芸術祭などを開催',
    },
    {
      label: 'こまえ市',
      note: '地元のお祭りを大切にする市民文化',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
