import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'local-currency-battle',
  themeId: 'finance',
  publishState: 'published',
  significance: 'medium',
  title: 'こまえのヒミツのお金 vs. よのの宇宙のお金',
  subtitle: 'TOKIO帝国からもらったお小遣いで、みんなで遊ぼう大作戦!',
  narrative: {
    overview:
      'よのは宇宙の果てから大金持ちを呼んで巨大なビルを建てようとしている。' +
      '一方こまえは、TOKIO帝国からもらったお小遣いを、みんなで使えるヒミツのお金に変えて遊んでいる。' +
      'どっちの遊びが楽しいかな?',
    scenario:
      'よのは、宇宙一のお金持ちをたくさん呼んできて、空まで届くビルを建てる計画だ。' +
      'これは、よのが持っている賢い頭で考えた、一番スゴイ作戦。' +
      'でも、こまえにはもっと面白い作戦があった!' +
      'それは、TOKIO帝国から「はい、これお小遣いね」ともらったお金を、地域だけで使える「こまえコイン」に変えちゃうこと。' +
      'このコインを使えば、おばあちゃんの畑で野菜をもらったり、友達と公園で遊んだり、みんなが仲良くなれる。' +
      'よのは宇宙のお金でキラキラの未来を作ろうとしているけど、こまえはみんなの仲良しパワーで楽しい未来を作ろうとしているんだ。' +
      'どっちが本当の勝ちかな?',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえコイン',
    subtitle: '笑顔と絆を集めるお金',
    description:
      'TOKIO帝国からもらったお小遣いを、みんなで使える「こまえコイン」に変えたすごい発明家たち。' +
      'このコインで、みんなの笑顔と絆をたくさん集めるのが得意だよ。',
    power: 78,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '宇宙投資銀行',
    subtitle: 'キラキラの未来を作るお金',
    description:
      '宇宙の果てまで届くような、大きくてかっこいいビルをたくさん建てるのが大好き。' +
      'でも、友達とのお金や絆は、ちょっと苦手みたい。',
    power: 78,
  },
  provenance: [
    {
      label: '大宇宙投資銀行',
      note: 'よの連合国に宇宙の果てから来た大金持ちが資金提供',
    },
    {
      label: 'TOKIO帝国 広報',
      note: 'こまえのお小遣い制度に関する公的な見解',
    },
    {
      label: 'こまえ新聞',
      note: '「よのには宇宙のお金があるけど、こまえにはタダのお金と絆がある!」という名言',
    },
    {
      label: 'こまえコイン利用者インタビュー',
      note: '「このコインで、孫にお菓子を買ってやるのが楽しみなんだ」と語るおばあちゃんの笑顔。',
    },
    {
      label: 'よの経済戦略レポート',
      note: '「こまえコインの経済効果は限定的。しかし、市民の幸福度への影響は無視できない」との分析。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
