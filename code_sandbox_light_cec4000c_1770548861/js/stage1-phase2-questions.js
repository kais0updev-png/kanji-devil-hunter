// Stage 1（ポチタ）Phase 2 問題データ
// 書き取り・部首・送り仮名・対義語・同音異字・三字熟語

const stage1Phase2Questions = [
  // ========================================
  // 書き取り問題（15問）- 読みから漢字を選ぶ
  // ========================================
  {
    id: "s1-write-1",
    stageId: 1,
    questionType: "writing",
    reading: "いち",
    question: "「いち」と読む漢字は？",
    choices: ["一", "二", "三", "七"],
    correctAnswer: 0,
    explanation: "「いち」は「一」と書きます。数字の1です。"
  },
  {
    id: "s1-write-2",
    stageId: 1,
    questionType: "writing",
    reading: "やま",
    question: "「やま」と読む漢字は？",
    choices: ["山", "川", "森", "林"],
    correctAnswer: 0,
    explanation: "「やま」は「山」と書きます。"
  },
  {
    id: "s1-write-3",
    stageId: 1,
    questionType: "writing",
    reading: "かわ",
    question: "「かわ」と読む漢字は？",
    choices: ["川", "河", "江", "海"],
    correctAnswer: 0,
    explanation: "「かわ」は「川」と書きます。"
  },
  {
    id: "s1-write-4",
    stageId: 1,
    questionType: "writing",
    reading: "ひと",
    question: "「ひと」と読む漢字は？",
    choices: ["人", "個", "者", "体"],
    correctAnswer: 0,
    explanation: "「ひと」は「人」と書きます。"
  },
  {
    id: "s1-write-5",
    stageId: 1,
    questionType: "writing",
    reading: "みず",
    question: "「みず」と読む漢字は？",
    choices: ["水", "氷", "湯", "泉"],
    correctAnswer: 0,
    explanation: "「みず」は「水」と書きます。"
  },
  {
    id: "s1-write-6",
    stageId: 1,
    questionType: "writing",
    reading: "き",
    question: "「き」と読む漢字は？",
    choices: ["木", "林", "森", "竹"],
    correctAnswer: 0,
    explanation: "「き」は「木」と書きます。"
  },
  {
    id: "s1-write-7",
    stageId: 1,
    questionType: "writing",
    reading: "て",
    question: "「て」と読む漢字は？",
    choices: ["手", "指", "腕", "足"],
    correctAnswer: 0,
    explanation: "「て」は「手」と書きます。"
  },
  {
    id: "s1-write-8",
    stageId: 1,
    questionType: "writing",
    reading: "あか",
    question: "「あか」と読む漢字は？",
    choices: ["赤", "青", "黄", "白"],
    correctAnswer: 0,
    explanation: "「あか」は「赤」と書きます。赤色の赤です。"
  },
  {
    id: "s1-write-9",
    stageId: 1,
    questionType: "writing",
    reading: "おおきい",
    question: "「おおきい」と読む漢字は？",
    choices: ["大", "小", "中", "高"],
    correctAnswer: 0,
    explanation: "「おおきい」は「大」と書きます。"
  },
  {
    id: "s1-write-10",
    stageId: 1,
    questionType: "writing",
    reading: "もり",
    question: "「もり」と読む漢字は？",
    choices: ["森", "林", "木", "山"],
    correctAnswer: 0,
    explanation: "「もり」は「森」と書きます。"
  },
  {
    id: "s1-write-11",
    stageId: 1,
    questionType: "writing",
    reading: "くち",
    question: "「くち」と読む漢字は？",
    choices: ["口", "目", "耳", "鼻"],
    correctAnswer: 0,
    explanation: "「くち」は「口」と書きます。"
  },
  {
    id: "s1-write-12",
    stageId: 1,
    questionType: "writing",
    reading: "め",
    question: "「め」と読む漢字は？",
    choices: ["目", "耳", "口", "鼻"],
    correctAnswer: 0,
    explanation: "「め」は「目」と書きます。"
  },
  {
    id: "s1-write-13",
    stageId: 1,
    questionType: "writing",
    reading: "いぬ",
    question: "「いぬ」と読む漢字は？",
    choices: ["犬", "猫", "馬", "牛"],
    correctAnswer: 0,
    explanation: "「いぬ」は「犬」と書きます。"
  },
  {
    id: "s1-write-14",
    stageId: 1,
    questionType: "writing",
    reading: "はな",
    question: "「はな」と読む漢字は？",
    choices: ["花", "草", "木", "葉"],
    correctAnswer: 0,
    explanation: "「はな」は「花」と書きます。"
  },
  {
    id: "s1-write-15",
    stageId: 1,
    questionType: "writing",
    reading: "あお",
    question: "「あお」と読む漢字は？",
    choices: ["青", "赤", "黄", "白"],
    correctAnswer: 0,
    explanation: "「あお」は「青」と書きます。青色の青です。"
  },

  // ========================================
  // 部首問題（8問）- 部首を選ぶ
  // ========================================
  {
    id: "s1-radical-1",
    stageId: 1,
    questionType: "radical",
    kanji: "休",
    question: "「休」の部首は？",
    choices: ["にんべん", "きへん", "さんずい", "くさかんむり"],
    correctAnswer: 0,
    explanation: "「休」の部首は「にんべん（亻）」です。人が木にもたれて休んでいる様子を表します。"
  },
  {
    id: "s1-radical-2",
    stageId: 1,
    questionType: "radical",
    kanji: "森",
    question: "「森」の部首は？",
    choices: ["きへん", "にんべん", "さんずい", "やまへん"],
    correctAnswer: 0,
    explanation: "「森」の部首は「木（きへん）」です。木が3つで森を表します。"
  },
  {
    id: "s1-radical-3",
    stageId: 1,
    questionType: "radical",
    kanji: "花",
    question: "「花」の部首は？",
    choices: ["くさかんむり", "きへん", "にんべん", "さんずい"],
    correctAnswer: 0,
    explanation: "「花」の部首は「くさかんむり（艹）」です。植物を表します。"
  },
  {
    id: "s1-radical-4",
    stageId: 1,
    questionType: "radical",
    kanji: "校",
    question: "「校」の部首は？",
    choices: ["きへん", "にんべん", "さんずい", "くさかんむり"],
    correctAnswer: 0,
    explanation: "「校」の部首は「きへん（木）」です。学校の校です。"
  },
  {
    id: "s1-radical-5",
    stageId: 1,
    questionType: "radical",
    kanji: "村",
    question: "「村」の部首は？",
    choices: ["きへん", "にんべん", "さんずい", "やまへん"],
    correctAnswer: 0,
    explanation: "「村」の部首は「きへん（木）」です。"
  },
  {
    id: "s1-radical-6",
    stageId: 1,
    questionType: "radical",
    kanji: "火",
    question: "「火」の部首は？",
    choices: ["ひへん", "きへん", "にんべん", "さんずい"],
    correctAnswer: 0,
    explanation: "「火」の部首は「ひへん（火）」です。"
  },
  {
    id: "s1-radical-7",
    stageId: 1,
    questionType: "radical",
    kanji: "雨",
    question: "「雨」の部首は？",
    choices: ["あめかんむり", "くさかんむり", "うかんむり", "やまへん"],
    correctAnswer: 0,
    explanation: "「雨」の部首は「あめかんむり（雨）」です。"
  },
  {
    id: "s1-radical-8",
    stageId: 1,
    questionType: "radical",
    kanji: "学",
    question: "「学」の部首は？",
    choices: ["こへん", "きへん", "にんべん", "さんずい"],
    correctAnswer: 0,
    explanation: "「学」の部首は「こへん（子）」です。学ぶ子供を表します。"
  },

  // ========================================
  // 送り仮名問題（8問）- 正しい送り仮名を選ぶ
  // ========================================
  {
    id: "s1-okurigana-1",
    stageId: 1,
    questionType: "okurigana",
    kanji: "見",
    question: "「見る」の送り仮名は？",
    choices: ["見る", "見ら", "見れ", "見り"],
    correctAnswer: 0,
    explanation: "「見る」が正しい送り仮名です。"
  },
  {
    id: "s1-okurigana-2",
    stageId: 1,
    questionType: "okurigana",
    kanji: "出",
    question: "「出す」の送り仮名は？",
    choices: ["出す", "出る", "出し", "出さ"],
    correctAnswer: 0,
    explanation: "「出す」が正しい送り仮名です。物を外に出すという意味です。"
  },
  {
    id: "s1-okurigana-3",
    stageId: 1,
    questionType: "okurigana",
    kanji: "入",
    question: "「入る」の送り仮名は？",
    choices: ["入る", "入れ", "入り", "入ら"],
    correctAnswer: 0,
    explanation: "「入る」が正しい送り仮名です。"
  },
  {
    id: "s1-okurigana-4",
    stageId: 1,
    questionType: "okurigana",
    kanji: "出",
    question: "「出る」の送り仮名は？",
    choices: ["出る", "出す", "出し", "出ら"],
    correctAnswer: 0,
    explanation: "「出る」が正しい送り仮名です。外に出るという意味です。"
  },
  {
    id: "s1-okurigana-5",
    stageId: 1,
    questionType: "okurigana",
    kanji: "立",
    question: "「立つ」の送り仮名は？",
    choices: ["立つ", "立ち", "立て", "立た"],
    correctAnswer: 0,
    explanation: "「立つ」が正しい送り仮名です。"
  },
  {
    id: "s1-okurigana-6",
    stageId: 1,
    questionType: "okurigana",
    kanji: "休",
    question: "「休む」の送り仮名は？",
    choices: ["休む", "休み", "休め", "休ま"],
    correctAnswer: 0,
    explanation: "「休む」が正しい送り仮名です。"
  },
  {
    id: "s1-okurigana-7",
    stageId: 1,
    questionType: "okurigana",
    kanji: "学",
    question: "「学ぶ」の送り仮名は？",
    choices: ["学ぶ", "学び", "学べ", "学ば"],
    correctAnswer: 0,
    explanation: "「学ぶ」が正しい送り仮名です。"
  },
  {
    id: "s1-okurigana-8",
    stageId: 1,
    questionType: "okurigana",
    kanji: "空",
    question: "「空く」の送り仮名は？",
    choices: ["空く", "空き", "空け", "空か"],
    correctAnswer: 0,
    explanation: "「空く」が正しい送り仮名です。"
  },

  // ========================================
  // 対義語問題（5問）- 反対の意味の漢字
  // ========================================
  {
    id: "s1-antonym-1",
    stageId: 1,
    questionType: "antonym",
    kanji: "上",
    question: "「上」の反対の意味の漢字は？",
    choices: ["下", "左", "右", "中"],
    correctAnswer: 0,
    explanation: "「上」の反対は「下」です。"
  },
  {
    id: "s1-antonym-2",
    stageId: 1,
    questionType: "antonym",
    kanji: "右",
    question: "「右」の反対の意味の漢字は？",
    choices: ["左", "上", "下", "前"],
    correctAnswer: 0,
    explanation: "「右」の反対は「左」です。"
  },
  {
    id: "s1-antonym-3",
    stageId: 1,
    questionType: "antonym",
    kanji: "大",
    question: "「大」の反対の意味の漢字は？",
    choices: ["小", "中", "高", "低"],
    correctAnswer: 0,
    explanation: "「大」の反対は「小」です。大きいと小さいは対義語です。"
  },
  {
    id: "s1-antonym-4",
    stageId: 1,
    questionType: "antonym",
    kanji: "入",
    question: "「入」の反対の意味の漢字は？",
    choices: ["出", "開", "閉", "来"],
    correctAnswer: 0,
    explanation: "「入」の反対は「出」です。入ると出るは対義語です。"
  },
  {
    id: "s1-antonym-5",
    stageId: 1,
    questionType: "antonym",
    kanji: "男",
    question: "「男」の反対の意味の漢字は？",
    choices: ["女", "子", "人", "親"],
    correctAnswer: 0,
    explanation: "「男」の反対は「女」です。"
  },

  // ========================================
  // 同音異字問題（5問）- 同じ読みの漢字
  // ========================================
  {
    id: "s1-homophone-1",
    stageId: 1,
    questionType: "homophone",
    reading: "き",
    question: "「き」と読む漢字で、木材の「き」は？",
    choices: ["木", "気", "生", "来"],
    correctAnswer: 0,
    explanation: "木材の「き」は「木」です。「気」も「き」と読みますが意味が違います。"
  },
  {
    id: "s1-homophone-2",
    stageId: 1,
    questionType: "homophone",
    reading: "は",
    question: "「は」と読む漢字で、植物の「は」は？",
    choices: ["葉", "歯", "刃", "波"],
    correctAnswer: 0,
    explanation: "植物の「は」は「葉」です。「歯」も「は」と読みますが意味が違います。"
  },
  {
    id: "s1-homophone-3",
    stageId: 1,
    questionType: "homophone",
    reading: "き",
    question: "「き」と読む漢字で、元気の「き」は？",
    choices: ["気", "木", "生", "来"],
    correctAnswer: 0,
    explanation: "元気の「き」は「気」です。「木」も「き」と読みますが意味が違います。"
  },
  {
    id: "s1-homophone-4",
    stageId: 1,
    questionType: "homophone",
    reading: "かい",
    question: "「かい」と読む漢字で、貝殻の「かい」は？",
    choices: ["貝", "会", "海", "回"],
    correctAnswer: 0,
    explanation: "貝殻の「かい」は「貝」です。"
  },
  {
    id: "s1-homophone-5",
    stageId: 1,
    questionType: "homophone",
    reading: "こう",
    question: "「こう」と読む漢字で、学校の「こう」は？",
    choices: ["校", "工", "口", "光"],
    correctAnswer: 0,
    explanation: "学校の「こう」は「校」です。「工」も「こう」と読みますが意味が違います。"
  },

  // ========================================
  // 三字熟語問題（3問）- 熟語を完成させる
  // ========================================
  {
    id: "s1-compound-1",
    stageId: 1,
    questionType: "compound",
    question: "「小学□」□に入る漢字は？",
    hint: "しょうがくせい",
    choices: ["生", "校", "人", "年"],
    correctAnswer: 0,
    explanation: "「小学生」が正しい三字熟語です。"
  },
  {
    id: "s1-compound-2",
    stageId: 1,
    questionType: "compound",
    question: "「男の□」□に入る漢字は？",
    hint: "おとこのこ",
    choices: ["子", "人", "児", "男"],
    correctAnswer: 0,
    explanation: "「男の子」が正しい熟語です。"
  },
  {
    id: "s1-compound-3",
    stageId: 1,
    questionType: "compound",
    question: "「下□場」□に入る漢字は？",
    hint: "げこうじょう",
    choices: ["校", "学", "門", "車"],
    correctAnswer: 0,
    explanation: "「下校場」が正しい熟語です。学校から帰る場所を表します。"
  }
];

// グローバルにエクスポート
window.stage1Phase2Questions = stage1Phase2Questions;

// エクスポート（Node.js環境用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = stage1Phase2Questions;
}
