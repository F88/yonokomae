import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'ancient-oracle-battle',
  publishState: 'published',
  themeId: 'culture',
  significance: 'medium',
  title: '古代の神託対決',
  subtitle: '星の運行か、大地の恵みか',
  narrative: {
    overview:
      '紀元前、よのは天文学から発展した疑似AIによる神託で民を導く。一方こまえは、多摩川の自然を崇拝し、手で築いた祭壇で結束する。どちらの信仰が、民に真の豊かさをもたらすか。',
    scenario:
      'よのには、天体の運行を精密に計算し未来を予測する巨大な天文盤『アストロラーベ』が存在した。これは星々の知識を集積した疑似AIであり、神官たちはその神託によって日食や干ばつを予言し、民を災厄から守った。完璧な予測は、よのに絶対的な秩序と安定をもたらした。対するこまえの民は、恵みと脅威をもたらす多摩川そのものを神と崇めた。彼らは川の氾濫で祭壇が流されるたびに、氏族で力を合わせ、より強固な祭壇を自らの手で築き直した。その共同作業こそが、彼らの結束の源泉だった。星が示す絶対の真実か、大地と共に生きる不確かな絆か。古代の二つの信仰が、民の未来を賭けて対峙する。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '大地の民',
    subtitle: '手で築く自然の祭壇',
    description:
      '多摩川の恵みと脅威を崇拝し、自然と共に生きる。災害で祭壇が壊されるたびに、氏族が協力して手で再建する。その過程こそが、彼らの揺るぎない絆と文化を育む。',
    power: 55,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '星詠みの民',
    subtitle: '疑似AIが示す星々の神殿',
    description:
      '天文学から発展した疑似AI『アストロラーベ』を用いて、星の運行から未来を予測する。その完璧な神託により、民を災厄から守り、絶対的な秩序と安定をもたらす。',
    power: 55,
  },
  provenance: [
    {
      label: 'よの天文院の粘土板記録',
      note: '「星の神託により、大飢饉を回避。民の99%が救われた」との記述。',
    },
    {
      label: 'こまえの族長の石碑',
      note: '「大洪水の年、我らは手を取り合い、新たな祭壇を築いた。これぞ我らの力なり」と刻まれている。',
    },
    {
      label: '旅の学者のパピルス',
      note: '「よのの民は星に未来を問い、こまえの民は互いの顔に未来を見る。どちらが真の強さか」と記されている。',
    },
    {
      label: '多摩川の渡し守の言い伝え',
      note: '「星は時に曇るが、この川の流れは嘘をつかん」と語り継がれている。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
