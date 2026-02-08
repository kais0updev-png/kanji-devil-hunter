// Stage 1（ポチタ）読み問題データ - 64問
// 10級（小学1年生）80字から64問を出題

const stage1Questions = [
  // 問題1-10
  {
    id: "s1-q1",
    stageId: 1,
    kanji: "一",
    questionType: "reading",
    question: "「一」の読みは？",
    choices: ["いち", "に", "さん", "し"],
    correctAnswer: 0,
    explanation: "「一」は「いち」と読みます。数字の1です。"
  },
  {
    id: "s1-q2",
    stageId: 1,
    kanji: "右",
    questionType: "reading",
    question: "「右」の読みは？",
    choices: ["みぎ", "ひだり", "うえ", "した"],
    correctAnswer: 0,
    explanation: "「右」は「みぎ」と読みます。"
  },
  {
    id: "s1-q3",
    stageId: 1,
    kanji: "雨",
    questionType: "reading",
    question: "「雨」の読みは？",
    choices: ["あめ", "ゆき", "かぜ", "くも"],
    correctAnswer: 0,
    explanation: "「雨」は「あめ」と読みます。"
  },
  {
    id: "s1-q4",
    stageId: 1,
    kanji: "円",
    questionType: "reading",
    question: "「円」の読みは？",
    choices: ["えん", "まる", "かく", "さんかく"],
    correctAnswer: 0,
    explanation: "「円」は「えん」と読みます。お金の単位です。"
  },
  {
    id: "s1-q5",
    stageId: 1,
    kanji: "王",
    questionType: "reading",
    question: "「王」の読みは？",
    choices: ["おう", "きん", "ぎょく", "たま"],
    correctAnswer: 0,
    explanation: "「王」は「おう」と読みます。王様の王です。"
  },
  {
    id: "s1-q6",
    stageId: 1,
    kanji: "音",
    questionType: "reading",
    question: "「音」の読みは？",
    choices: ["おと", "こえ", "うた", "ね"],
    correctAnswer: 0,
    explanation: "「音」は「おと」と読みます。"
  },
  {
    id: "s1-q7",
    stageId: 1,
    kanji: "下",
    questionType: "reading",
    question: "「下」の読みは？",
    choices: ["した", "うえ", "よこ", "まえ"],
    correctAnswer: 0,
    explanation: "「下」は「した」と読みます。"
  },
  {
    id: "s1-q8",
    stageId: 1,
    kanji: "火",
    questionType: "reading",
    question: "「火」の読みは？",
    choices: ["ひ", "みず", "つち", "かぜ"],
    correctAnswer: 0,
    explanation: "「火」は「ひ」と読みます。"
  },
  {
    id: "s1-q9",
    stageId: 1,
    kanji: "花",
    questionType: "reading",
    question: "「花」の読みは？",
    choices: ["はな", "き", "くさ", "は"],
    correctAnswer: 0,
    explanation: "「花」は「はな」と読みます。"
  },
  {
    id: "s1-q10",
    stageId: 1,
    kanji: "貝",
    questionType: "reading",
    question: "「貝」の読みは？",
    choices: ["かい", "さかな", "むし", "とり"],
    correctAnswer: 0,
    explanation: "「貝」は「かい」と読みます。"
  },
  
  // 問題11-20
  {
    id: "s1-q11",
    stageId: 1,
    kanji: "学",
    questionType: "reading",
    question: "「学」の読みは？",
    choices: ["がく", "こう", "きょう", "しょ"],
    correctAnswer: 0,
    explanation: "「学」は「がく」と読みます。学校の学です。"
  },
  {
    id: "s1-q12",
    stageId: 1,
    kanji: "気",
    questionType: "reading",
    question: "「気」の読みは？",
    choices: ["き", "ゆき", "あめ", "かぜ"],
    correctAnswer: 0,
    explanation: "「気」は「き」と読みます。天気の気です。"
  },
  {
    id: "s1-q13",
    stageId: 1,
    kanji: "九",
    questionType: "reading",
    question: "「九」の読みは？",
    choices: ["きゅう", "く", "ご", "ろく"],
    correctAnswer: 0,
    explanation: "「九」は「きゅう」または「く」と読みます。数字の9です。"
  },
  {
    id: "s1-q14",
    stageId: 1,
    kanji: "休",
    questionType: "reading",
    question: "「休」の読みは？",
    choices: ["きゅう", "やす", "ねむ", "あそ"],
    correctAnswer: 0,
    explanation: "「休」は音読みで「きゅう」、訓読みで「やす-む」と読みます。"
  },
  {
    id: "s1-q15",
    stageId: 1,
    kanji: "玉",
    questionType: "reading",
    question: "「玉」の読みは？",
    choices: ["たま", "いし", "かね", "つち"],
    correctAnswer: 0,
    explanation: "「玉」は「たま」と読みます。"
  },
  {
    id: "s1-q16",
    stageId: 1,
    kanji: "金",
    questionType: "reading",
    question: "「金」の読みは？",
    choices: ["きん", "ぎん", "どう", "てつ"],
    correctAnswer: 0,
    explanation: "「金」は「きん」と読みます。お金の金です。"
  },
  {
    id: "s1-q17",
    stageId: 1,
    kanji: "空",
    questionType: "reading",
    question: "「空」の読みは？",
    choices: ["そら", "うみ", "やま", "かわ"],
    correctAnswer: 0,
    explanation: "「空」は「そら」と読みます。"
  },
  {
    id: "s1-q18",
    stageId: 1,
    kanji: "月",
    questionType: "reading",
    question: "「月」の読みは？",
    choices: ["つき", "ひ", "ほし", "くも"],
    correctAnswer: 0,
    explanation: "「月」は「つき」と読みます。"
  },
  {
    id: "s1-q19",
    stageId: 1,
    kanji: "犬",
    questionType: "reading",
    question: "「犬」の読みは？",
    choices: ["いぬ", "ねこ", "とり", "うま"],
    correctAnswer: 0,
    explanation: "「犬」は「いぬ」と読みます。"
  },
  {
    id: "s1-q20",
    stageId: 1,
    kanji: "見",
    questionType: "reading",
    question: "「見」の読みは？",
    choices: ["み", "き", "よ", "かん"],
    correctAnswer: 0,
    explanation: "「見」は「み-る」と読みます。"
  },
  
  // 問題21-30
  {
    id: "s1-q21",
    stageId: 1,
    kanji: "五",
    questionType: "reading",
    question: "「五」の読みは？",
    choices: ["ご", "よん", "ろく", "なな"],
    correctAnswer: 0,
    explanation: "「五」は「ご」と読みます。数字の5です。"
  },
  {
    id: "s1-q22",
    stageId: 1,
    kanji: "口",
    questionType: "reading",
    question: "「口」の読みは？",
    choices: ["くち", "め", "はな", "みみ"],
    correctAnswer: 0,
    explanation: "「口」は「くち」と読みます。"
  },
  {
    id: "s1-q23",
    stageId: 1,
    kanji: "校",
    questionType: "reading",
    question: "「校」の読みは？",
    choices: ["こう", "がく", "きょう", "しょ"],
    correctAnswer: 0,
    explanation: "「校」は「こう」と読みます。学校の校です。"
  },
  {
    id: "s1-q24",
    stageId: 1,
    kanji: "左",
    questionType: "reading",
    question: "「左」の読みは？",
    choices: ["ひだり", "みぎ", "まえ", "うしろ"],
    correctAnswer: 0,
    explanation: "「左」は「ひだり」と読みます。"
  },
  {
    id: "s1-q25",
    stageId: 1,
    kanji: "三",
    questionType: "reading",
    question: "「三」の読みは？",
    choices: ["さん", "に", "よん", "ご"],
    correctAnswer: 0,
    explanation: "「三」は「さん」と読みます。数字の3です。"
  },
  {
    id: "s1-q26",
    stageId: 1,
    kanji: "山",
    questionType: "reading",
    question: "「山」の読みは？",
    choices: ["やま", "かわ", "うみ", "そら"],
    correctAnswer: 0,
    explanation: "「山」は「やま」と読みます。"
  },
  {
    id: "s1-q27",
    stageId: 1,
    kanji: "子",
    questionType: "reading",
    question: "「子」の読みは？",
    choices: ["こ", "おや", "ちち", "はは"],
    correctAnswer: 0,
    explanation: "「子」は「こ」と読みます。子供の子です。"
  },
  {
    id: "s1-q28",
    stageId: 1,
    kanji: "四",
    questionType: "reading",
    question: "「四」の読みは？",
    choices: ["し", "さん", "ご", "ろく"],
    correctAnswer: 0,
    explanation: "「四」は「し」または「よん」と読みます。数字の4です。"
  },
  {
    id: "s1-q29",
    stageId: 1,
    kanji: "糸",
    questionType: "reading",
    question: "「糸」の読みは？",
    choices: ["いと", "ぬの", "かみ", "かわ"],
    correctAnswer: 0,
    explanation: "「糸」は「いと」と読みます。"
  },
  {
    id: "s1-q30",
    stageId: 1,
    kanji: "字",
    questionType: "reading",
    question: "「字」の読みは？",
    choices: ["じ", "もじ", "ぶん", "しょ"],
    correctAnswer: 0,
    explanation: "「字」は「じ」と読みます。文字の字です。"
  },
  
  // 問題31-40
  {
    id: "s1-q31",
    stageId: 1,
    kanji: "耳",
    questionType: "reading",
    question: "「耳」の読みは？",
    choices: ["みみ", "め", "はな", "くち"],
    correctAnswer: 0,
    explanation: "「耳」は「みみ」と読みます。"
  },
  {
    id: "s1-q32",
    stageId: 1,
    kanji: "七",
    questionType: "reading",
    question: "「七」の読みは？",
    choices: ["しち", "ろく", "はち", "きゅう"],
    correctAnswer: 0,
    explanation: "「七」は「しち」または「なな」と読みます。数字の7です。"
  },
  {
    id: "s1-q33",
    stageId: 1,
    kanji: "車",
    questionType: "reading",
    question: "「車」の読みは？",
    choices: ["くるま", "でんしゃ", "じどうしゃ", "バス"],
    correctAnswer: 0,
    explanation: "「車」は「くるま」と読みます。"
  },
  {
    id: "s1-q34",
    stageId: 1,
    kanji: "手",
    questionType: "reading",
    question: "「手」の読みは？",
    choices: ["て", "あし", "め", "みみ"],
    correctAnswer: 0,
    explanation: "「手」は「て」と読みます。"
  },
  {
    id: "s1-q35",
    stageId: 1,
    kanji: "十",
    questionType: "reading",
    question: "「十」の読みは？",
    choices: ["じゅう", "きゅう", "じゅういち", "はち"],
    correctAnswer: 0,
    explanation: "「十」は「じゅう」と読みます。数字の10です。"
  },
  {
    id: "s1-q36",
    stageId: 1,
    kanji: "出",
    questionType: "reading",
    question: "「出」の読みは？",
    choices: ["で", "い", "き", "かえ"],
    correctAnswer: 0,
    explanation: "「出」は「で-る」「だ-す」と読みます。"
  },
  {
    id: "s1-q37",
    stageId: 1,
    kanji: "女",
    questionType: "reading",
    question: "「女」の読みは？",
    choices: ["おんな", "おとこ", "こども", "おや"],
    correctAnswer: 0,
    explanation: "「女」は「おんな」と読みます。"
  },
  {
    id: "s1-q38",
    stageId: 1,
    kanji: "小",
    questionType: "reading",
    question: "「小」の読みは？",
    choices: ["しょう", "だい", "ちゅう", "こう"],
    correctAnswer: 0,
    explanation: "「小」は「しょう」と読みます。小学校の小です。"
  },
  {
    id: "s1-q39",
    stageId: 1,
    kanji: "上",
    questionType: "reading",
    question: "「上」の読みは？",
    choices: ["うえ", "した", "よこ", "なか"],
    correctAnswer: 0,
    explanation: "「上」は「うえ」と読みます。"
  },
  {
    id: "s1-q40",
    stageId: 1,
    kanji: "森",
    questionType: "reading",
    question: "「森」の読みは？",
    choices: ["もり", "はやし", "き", "やま"],
    correctAnswer: 0,
    explanation: "「森」は「もり」と読みます。"
  },
  
  // 問題41-50
  {
    id: "s1-q41",
    stageId: 1,
    kanji: "人",
    questionType: "reading",
    question: "「人」の読みは？",
    choices: ["ひと", "ひとり", "ふたり", "さんにん"],
    correctAnswer: 0,
    explanation: "「人」は「ひと」と読みます。"
  },
  {
    id: "s1-q42",
    stageId: 1,
    kanji: "水",
    questionType: "reading",
    question: "「水」の読みは？",
    choices: ["みず", "ゆ", "こおり", "あめ"],
    correctAnswer: 0,
    explanation: "「水」は「みず」と読みます。"
  },
  {
    id: "s1-q43",
    stageId: 1,
    kanji: "正",
    questionType: "reading",
    question: "「正」の読みは？",
    choices: ["せい", "ただ", "まさ", "しょう"],
    correctAnswer: 0,
    explanation: "「正」は「せい」「しょう」と読みます。正しいの正です。"
  },
  {
    id: "s1-q44",
    stageId: 1,
    kanji: "生",
    questionType: "reading",
    question: "「生」の読みは？",
    choices: ["せい", "い", "う", "しょう"],
    correctAnswer: 0,
    explanation: "「生」は「せい」「しょう」と読みます。学生の生です。"
  },
  {
    id: "s1-q45",
    stageId: 1,
    kanji: "青",
    questionType: "reading",
    question: "「青」の読みは？",
    choices: ["あお", "あか", "きいろ", "しろ"],
    correctAnswer: 0,
    explanation: "「青」は「あお」と読みます。青色の青です。"
  },
  {
    id: "s1-q46",
    stageId: 1,
    kanji: "夕",
    questionType: "reading",
    question: "「夕」の読みは？",
    choices: ["ゆう", "あさ", "ひる", "よる"],
    correctAnswer: 0,
    explanation: "「夕」は「ゆう」と読みます。夕方の夕です。"
  },
  {
    id: "s1-q47",
    stageId: 1,
    kanji: "石",
    questionType: "reading",
    question: "「石」の読みは？",
    choices: ["いし", "つち", "すな", "かわ"],
    correctAnswer: 0,
    explanation: "「石」は「いし」と読みます。"
  },
  {
    id: "s1-q48",
    stageId: 1,
    kanji: "赤",
    questionType: "reading",
    question: "「赤」の読みは？",
    choices: ["あか", "あお", "きいろ", "くろ"],
    correctAnswer: 0,
    explanation: "「赤」は「あか」と読みます。赤色の赤です。"
  },
  {
    id: "s1-q49",
    stageId: 1,
    kanji: "千",
    questionType: "reading",
    question: "「千」の読みは？",
    choices: ["せん", "ひゃく", "まん", "おく"],
    correctAnswer: 0,
    explanation: "「千」は「せん」と読みます。1000のことです。"
  },
  {
    id: "s1-q50",
    stageId: 1,
    kanji: "川",
    questionType: "reading",
    question: "「川」の読みは？",
    choices: ["かわ", "うみ", "やま", "そら"],
    correctAnswer: 0,
    explanation: "「川」は「かわ」と読みます。"
  },
  
  // 問題51-60
  {
    id: "s1-q51",
    stageId: 1,
    kanji: "先",
    questionType: "reading",
    question: "「先」の読みは？",
    choices: ["せん", "さき", "あと", "まえ"],
    correctAnswer: 0,
    explanation: "「先」は「せん」「さき」と読みます。先生の先です。"
  },
  {
    id: "s1-q52",
    stageId: 1,
    kanji: "早",
    questionType: "reading",
    question: "「早」の読みは？",
    choices: ["はや", "おそ", "あさ", "よる"],
    correctAnswer: 0,
    explanation: "「早」は「はや-い」と読みます。"
  },
  {
    id: "s1-q53",
    stageId: 1,
    kanji: "草",
    questionType: "reading",
    question: "「草」の読みは？",
    choices: ["くさ", "き", "はな", "は"],
    correctAnswer: 0,
    explanation: "「草」は「くさ」と読みます。"
  },
  {
    id: "s1-q54",
    stageId: 1,
    kanji: "足",
    questionType: "reading",
    question: "「足」の読みは？",
    choices: ["あし", "て", "め", "みみ"],
    correctAnswer: 0,
    explanation: "「足」は「あし」と読みます。"
  },
  {
    id: "s1-q55",
    stageId: 1,
    kanji: "村",
    questionType: "reading",
    question: "「村」の読みは？",
    choices: ["むら", "まち", "し", "くに"],
    correctAnswer: 0,
    explanation: "「村」は「むら」と読みます。"
  },
  {
    id: "s1-q56",
    stageId: 1,
    kanji: "大",
    questionType: "reading",
    question: "「大」の読みは？",
    choices: ["だい", "しょう", "ちゅう", "こう"],
    correctAnswer: 0,
    explanation: "「大」は「だい」「おお-きい」と読みます。"
  },
  {
    id: "s1-q57",
    stageId: 1,
    kanji: "男",
    questionType: "reading",
    question: "「男」の読みは？",
    choices: ["おとこ", "おんな", "こども", "おや"],
    correctAnswer: 0,
    explanation: "「男」は「おとこ」と読みます。"
  },
  {
    id: "s1-q58",
    stageId: 1,
    kanji: "竹",
    questionType: "reading",
    question: "「竹」の読みは？",
    choices: ["たけ", "き", "くさ", "はな"],
    correctAnswer: 0,
    explanation: "「竹」は「たけ」と読みます。"
  },
  {
    id: "s1-q59",
    stageId: 1,
    kanji: "中",
    questionType: "reading",
    question: "「中」の読みは？",
    choices: ["ちゅう", "うえ", "した", "そと"],
    correctAnswer: 0,
    explanation: "「中」は「ちゅう」「なか」と読みます。中学校の中です。"
  },
  {
    id: "s1-q60",
    stageId: 1,
    kanji: "虫",
    questionType: "reading",
    question: "「虫」の読みは？",
    choices: ["むし", "とり", "さかな", "けもの"],
    correctAnswer: 0,
    explanation: "「虫」は「むし」と読みます。"
  },
  
  // 問題61-64（最後の4問）
  {
    id: "s1-q61",
    stageId: 1,
    kanji: "町",
    questionType: "reading",
    question: "「町」の読みは？",
    choices: ["まち", "むら", "し", "くに"],
    correctAnswer: 0,
    explanation: "「町」は「まち」と読みます。"
  },
  {
    id: "s1-q62",
    stageId: 1,
    kanji: "天",
    questionType: "reading",
    question: "「天」の読みは？",
    choices: ["てん", "ち", "そら", "やま"],
    correctAnswer: 0,
    explanation: "「天」は「てん」と読みます。天気の天です。"
  },
  {
    id: "s1-q63",
    stageId: 1,
    kanji: "田",
    questionType: "reading",
    question: "「田」の読みは？",
    choices: ["た", "はたけ", "やま", "のはら"],
    correctAnswer: 0,
    explanation: "「田」は「た」と読みます。田んぼの田です。"
  },
  {
    id: "s1-q64",
    stageId: 1,
    kanji: "土",
    questionType: "reading",
    question: "「土」の読みは？",
    choices: ["つち", "いし", "すな", "どろ"],
    correctAnswer: 0,
    explanation: "「土」は「つち」と読みます。"
  }
];

// グローバルにエクスポート
window.stage1Questions = stage1Questions;

// エクスポート（Node.js環境用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = stage1Questions;
}
