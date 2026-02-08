// ========================================
// チェンソーマン 漢字デビルハンター
// JavaScript Application Logic
// ========================================

// ========================================
// 🔧 STARTUP DIAGNOSTICS & ERROR HANDLING
// ========================================

console.log('🚀 chainsaw-app.js loaded');
console.log(`📅 Loaded at: ${new Date().toISOString()}`);

// Global error handler
window.addEventListener('error', (event) => {
  console.error('❌ Global Error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled Promise Rejection:', {
    reason: event.reason,
    promise: event.promise
  });
});

// Verify critical functions are defined
window.addEventListener('DOMContentLoaded', () => {
  console.log('🔍 Verifying critical functions...');
  
  const criticalFunctions = [
    'startCardsSession',
    'showCardsScreen',
    'displayCurrentCard',
    'flipTheCard',
    'goToNextCard',
    'goToPreviousCard',
    'markCardRemembered',
    'markCardNotRemembered'
  ];
  
  criticalFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function' || typeof eval(`typeof ${funcName}`) === 'function') {
      console.log(`✅ ${funcName} is defined`);
    } else {
      console.error(`❌ ${funcName} is NOT defined`);
    }
  });
});

// ========================================
// グローバル変数
// ========================================
let currentStage = 1;
let currentMode = 'reading'; // デフォルトは読み問題
let currentQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = [];
let skippedAnswers = [];
let isReviewMode = false;
let stageProgress = {}; // {1: 45, 2: 20, ...}

// ローカルストレージのキー
const STORAGE_KEY_PROGRESS = 'csmKanjiProgress';
const STORAGE_KEY_WRONG = 'csmKanjiWrong';
const STORAGE_KEY_REPORTS = 'csmQuestionReports'; // 🔧 管理者機能: 問題報告
const STORAGE_KEY_UNLOCK_ALL = 'csmAllStagesUnlocked'; // 🔓 全ステージアンロック機能
const STORAGE_KEY_CARDS_PROGRESS = 'csmCardsProgress'; // 🃏 カード学習: 進捗
const STORAGE_KEY_CARDS_REVIEW = 'csmCardsReview'; // 🃏 カード学習: 復習リスト

// 漢字カードデータURL
const CARDS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1vPMvHQpzC190LwYTWepPlnDLsRfoT0OkWu4aU_oNipE/export?format=csv&gid=807901471';

// ステージ設定（10ステージ × 動的問題数 = 統合CSV対応）
// size は初期値（実際の問題数はCSV読み込み後に動的更新）
const STAGES = [
  { 
    id: 1, 
    name: 'ポチタ', 
    icon: '🐕', 
    color: 'pochita', 
    size: 0,  // ✨ 動的更新
    imagePath: '/chainsaw_man_images/ポチタ/001_56c00a62.jpg'
  },
  { 
    id: 2, 
    name: 'マキマ', 
    icon: '👁️', 
    color: 'makima', 
    size: 0,  // ✨ 動的更新
    imagePath: '/chainsaw_man_images/マキマ/001_3e60b875.jpg'
  },
  { 
    id: 3, 
    name: 'アキ', 
    icon: '🗡️', 
    color: 'aki', 
    size: 0,  // ✨ 動的更新
    imagePath: '/chainsaw_man_images/早川アキ/001_1cc3517f.jpg'
  },
  { 
    id: 4, 
    name: 'パワー', 
    icon: '🩸', 
    color: 'power', 
    size: 0,  // ✨ 動的更新
    imagePath: '/chainsaw_man_images/パワー/001_6335dc07.jpg'
  },
  { 
    id: 5, 
    name: '姫野', 
    icon: '👻', 
    color: 'himeno', 
    size: 0,  // ✨ 動的更新
    imagePath: '/chainsaw_man_images/姫野/001_9749797f.jpg'
  },
  { 
    id: 6, 
    name: 'コベニ', 
    icon: '😰', 
    color: 'kobeni', 
    size: 0,  // ✨ 動的更新
    imagePath: '/chainsaw_man_images/コベニ/001_c6234632.jpg'
  },
  { 
    id: 7, 
    name: 'レゼ', 
    icon: '💣', 
    color: 'reze', 
    size: 0,  // ✨ 動的更新
    imagePath: '/chainsaw_man_images/レゼ/001_c24cfcf9.jpg'
  },
  { 
    id: 8, 
    name: 'ビーム', 
    icon: '🦈', 
    color: 'beam', 
    size: 0,  // ✨ 動的更新
    imagePath: '/chainsaw_man_images/ビーム/001_12fa6b9e.jpg'
  },
  { 
    id: 9, 
    name: '岸辺', 
    icon: '🥃', 
    color: 'kishibe', 
    size: 0,  // ✨ 動的更新
    imagePath: '/chainsaw_man_images/岸辺/001_b138ae5c.jpg'
  },
  { 
    id: 10, 
    name: 'チェンソーマン', 
    icon: '🪚', 
    color: 'chainsaw', 
    size: 0,  // ✨ 動的更新
    imagePath: '/chainsaw_man_images/デンジ/001_5f33a725.jpg'
  }
];

/**
 * CSVデータから各ステージの問題数を動的に更新
 * @returns {Promise<void>}
 */
async function updateStageQuestionCounts() {
  // 全問題を読み込み
  if (!window.allQuestionsCache) {
    await window.loadAllQuestions();
  }
  
  // ステージごとの問題数を集計
  const counts = {};
  window.allQuestionsCache.forEach(q => {
    counts[q.stageId] = (counts[q.stageId] || 0) + 1;
  });
  
  // STAGES配列のsizeを更新
  STAGES.forEach(stage => {
    stage.size = counts[stage.id] || 0;
  });
  
  console.log('📊 各ステージの問題数を更新しました');
}

// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', async function() {
  try {
    console.log('✅ アプリ起動開始');
    
    // ローディング画面を表示
    showLoadingScreen();
    
    // 問題データを事前読み込み
    await window.loadAllQuestions();
    
    console.log(`📊 総漢字数: ${window.kanjiData.length}字`);
    
    // ステージの問題数を動的に更新
    await updateStageQuestionCounts();
    
    // 進捗読み込み
    loadProgress();
    
    // 全体進捗更新
    updateOverallProgress();
    
    // ステージ進捗表示更新
    updateAllStageProgress();
    
    // ローディング画面を非表示
    hideLoadingScreen();
    
    console.log('✅ アプリ起動完了');
    
  } catch (error) {
    console.error('❌ アプリ初期化エラー:', error);
    showErrorScreen(error.message, error.stack);
  }
});

/**
 * ローディング画面を表示
 */
function showLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  const main = document.querySelector('.csm-main');
  const header = document.querySelector('.csm-header');
  
  if (loadingScreen) {
    loadingScreen.classList.remove('hidden');
  }
  if (main) {
    main.style.visibility = 'hidden';
  }
  if (header) {
    header.style.visibility = 'hidden';
  }
}

/**
 * ローディング画面を非表示
 */
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  const main = document.querySelector('.csm-main');
  const header = document.querySelector('.csm-header');
  
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
  if (main) {
    main.style.visibility = 'visible';
  }
  if (header) {
    header.style.visibility = 'visible';
  }
}

/**
 * エラー画面を表示
 */
function showErrorScreen(message, details = '') {
  const errorScreen = document.getElementById('errorScreen');
  const errorMessage = document.getElementById('errorMessage');
  const errorDetailsText = document.getElementById('errorDetailsText');
  const loadingScreen = document.getElementById('loadingScreen');
  const main = document.querySelector('.csm-main');
  const header = document.querySelector('.csm-header');
  
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
  if (main) {
    main.style.visibility = 'hidden';
  }
  if (header) {
    header.style.visibility = 'hidden';
  }
  
  if (errorScreen) {
    errorScreen.classList.remove('hidden');
  }
  if (errorMessage) {
    errorMessage.textContent = message || '問題データの読み込みに失敗しました。';
  }
  if (errorDetailsText) {
    errorDetailsText.textContent = details || 'エラー詳細なし';
  }
}

/**
 * エラー詳細を表示/非表示
 */
function showErrorDetails() {
  const errorDetails = document.getElementById('errorDetails');
  if (errorDetails) {
    errorDetails.classList.toggle('hidden');
  }
}

// ========================================
// ローカルストレージ管理
// ========================================
function loadProgress() {
  const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
  if (saved) {
    stageProgress = JSON.parse(saved);
  } else {
    // 初期化：全ステージ0
    for (let i = 1; i <= 10; i++) {
      stageProgress[i] = 0;
    }
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(stageProgress));
}

function getWrongAnswersFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY_WRONG);
  return saved ? JSON.parse(saved) : [];
}

function saveWrongAnswersToStorage() {
  const allWrong = [...wrongAnswers, ...skippedAnswers];
  localStorage.setItem(STORAGE_KEY_WRONG, JSON.stringify(allWrong));
}

// ========================================
// 全ステージアンロック機能
// ========================================

/**
 * 全ステージアンロック状態を取得
 * @returns {boolean} - アンロック中ならtrue
 */
function isAllStagesUnlocked() {
  const value = localStorage.getItem(STORAGE_KEY_UNLOCK_ALL);
  return value === 'true';
}

/**
 * 全ステージをアンロック
 */
function unlockAllStages() {
  localStorage.setItem(STORAGE_KEY_UNLOCK_ALL, 'true');
  console.log('🔓 全ステージをアンロックしました');
}

/**
 * 通常のロック状態に戻す
 */
function lockAllStages() {
  localStorage.removeItem(STORAGE_KEY_UNLOCK_ALL);
  console.log('🔒 通常のロック状態に戻しました');
}

/**
 * 指定ステージがプレイ可能かチェック
 * @param {number} stageId - ステージID（1-10）
 * @param {boolean} previousStageCompleted - 前のステージが完了しているか
 * @returns {boolean} - プレイ可能ならtrue
 */
function isStagePlayable(stageId, previousStageCompleted) {
  // 全ステージアンロック状態なら常にtrue
  if (isAllStagesUnlocked()) {
    return true;
  }
  
  // Stage 1は常にプレイ可能
  if (stageId === 1) {
    return true;
  }
  
  // それ以外は前ステージ完了が条件
  return previousStageCompleted;
}

// ========================================
// 問題報告機能（管理者用）
// ========================================

/**
 * 問題報告を保存
 * @param {Object} question - 報告する問題
 * @param {number|undefined} userAnswer - ユーザーの回答（0-3）
 * @param {boolean|undefined} isCorrect - 正誤判定
 */
function saveQuestionReport(question, userAnswer = undefined, isCorrect = undefined) {
  const reports = getQuestionReports();
  
  // 重複チェック（同じ問題IDは1回のみ報告）
  const alreadyReported = reports.some(r => r.questionId === question.id);
  if (alreadyReported) {
    console.log(`⚠️ Question ${question.id} already reported`);
    return false;
  }
  
  // 新規報告を作成
  const report = {
    id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    questionId: question.id,
    stageId: question.stageId,
    kanji: question.kanji,
    questionType: question.questionType,
    question: question.question,
    choices: question.choices,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    reportedAt: new Date().toISOString(),
    userAnswer: userAnswer,
    isCorrect: isCorrect
  };
  
  reports.push(report);
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  
  console.log(`📝 Question reported: ${question.id}`);
  return true;
}

/**
 * 全報告を取得
 * @returns {Array} - 報告データ配列
 */
function getQuestionReports() {
  const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
  return saved ? JSON.parse(saved) : [];
}

/**
 * 報告を削除
 * @param {string} reportId - 報告ID
 */
function deleteQuestionReport(reportId) {
  let reports = getQuestionReports();
  reports = reports.filter(r => r.id !== reportId);
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  console.log(`🗑️ Report deleted: ${reportId}`);
}

/**
 * 全報告を削除
 */
function clearAllQuestionReports() {
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify([]));
  console.log('🗑️ All reports cleared');
}

/**
 * CSV形式で報告データをエクスポート
 * @returns {string} - CSV文字列
 */
function exportReportsToCSV() {
  const reports = getQuestionReports();
  
  if (reports.length === 0) {
    return null;
  }
  
  // CSV ヘッダー
  const headers = [
    'Report ID',
    'Question ID',
    'Stage',
    'Kanji',
    'Type',
    'Question',
    'Choice 1',
    'Choice 2',
    'Choice 3',
    'Choice 4',
    'Correct Answer (0-3)',
    'User Answer (0-3)',
    'Is Correct',
    'Explanation',
    'Reported At'
  ];
  
  // CSV データ
  const rows = reports.map(r => [
    r.id,
    r.questionId,
    r.stageId,
    r.kanji,
    r.questionType,
    `"${(r.question || '').replace(/"/g, '""')}"`,  // エスケープ
    `"${(r.choices[0] || '').replace(/"/g, '""')}"`,
    `"${(r.choices[1] || '').replace(/"/g, '""')}"`,
    `"${(r.choices[2] || '').replace(/"/g, '""')}"`,
    `"${(r.choices[3] || '').replace(/"/g, '""')}"`,
    r.correctAnswer,
    r.userAnswer !== undefined ? r.userAnswer : '',
    r.isCorrect !== undefined ? r.isCorrect : '',
    `"${(r.explanation || '').replace(/"/g, '""')}"`,
    r.reportedAt
  ]);
  
  // CSV 文字列生成
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

// ========================================
// 画面切り替え
// ========================================
function showScreen(screenId) {
  const screens = ['homeScreen', 'quizScreen', 'resultScreen', 'adminScreen'];
  screens.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(screenId).classList.remove('hidden');
  
  // ナビゲーションのアクティブ状態を更新
  document.querySelectorAll('.csm-nav-link').forEach(link => {
    link.classList.remove('active');
  });
  if (screenId === 'homeScreen') {
    document.querySelector('.csm-nav-link').classList.add('active');
  } else if (screenId === 'adminScreen') {
    document.querySelector('.admin-nav-link').classList.add('active');
  }
}

function goHome() {
  showScreen('homeScreen');
  currentMode = 'reading';
  currentQuestions = [];
  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = [];
  skippedAnswers = [];
  isReviewMode = false;
  updateAllStageProgress();
  updateOverallProgress();
}

// ========================================
// 全体進捗表示
// ========================================
function updateOverallProgress() {
  const totalKanji = window.kanjiData.length;
  const clearedKanji = Object.values(stageProgress).reduce((sum, val) => sum + val, 0);
  const percentage = Math.floor((clearedKanji / totalKanji) * 100);
  
  // 基本進捗
  document.getElementById('clearedCount').textContent = clearedKanji;
  document.getElementById('totalCount').textContent = totalKanji;
  document.getElementById('overallProgressBar').style.width = percentage + '%';
  document.getElementById('overallProgressLabel').textContent = percentage + '%';
  
  // クリア済ステージ数を計算
  let clearedStages = 0;
  let currentStageNum = 1;
  let nextStageRemaining = 64;
  
  STAGES.forEach(stage => {
    const progress = stageProgress[stage.id] || 0;
    if (progress >= stage.size) {
      clearedStages++;
    }
  });
  
  // 現在のステージを特定（最初の未クリアステージ）
  for (let i = 0; i < STAGES.length; i++) {
    const stage = STAGES[i];
    const progress = stageProgress[stage.id] || 0;
    if (progress < stage.size) {
      currentStageNum = stage.id;
      nextStageRemaining = stage.size - progress;
      break;
    }
  }
  
  // 詳細情報を更新
  document.getElementById('clearedStages').textContent = `${clearedStages} / 10`;
  document.getElementById('currentStageDisplay').textContent = `Stage ${currentStageNum}`;
  
  if (clearedStages === 10) {
    document.getElementById('nextStageProgress').textContent = '完了！';
  } else {
    document.getElementById('nextStageProgress').textContent = `${nextStageRemaining}体`;
  }
}

// ========================================
// ステージ進捗表示更新
// ========================================
function updateAllStageProgress() {
  STAGES.forEach(stage => {
    const progress = stageProgress[stage.id] || 0;
    const progressText = `${progress} / ${stage.size} 体`;
    const progressElement = document.getElementById(`progress-${stage.id}`);
    if (progressElement) {
      progressElement.textContent = progressText;
    }
    
    // ステージカードのロック状態を更新
    updateStageCardStatus(stage.id);
  });
}

function updateStageCardStatus(stageId) {
  const card = document.querySelector(`.csm-stage-card:nth-child(${stageId})`);
  const statusIcon = card.querySelector('.csm-stage-card-status');
  const progress = stageProgress[stageId] || 0;
  const stage = STAGES.find(s => s.id === stageId);
  
  // 前のステージがクリアされているかチェック
  const prevStage = stageId === 1 ? null : STAGES.find(s => s.id === stageId - 1);
  const prevProgress = prevStage ? (stageProgress[stageId - 1] || 0) : 0;
  const previousStageCompleted = !prevStage || (prevProgress >= prevStage.size);
  
  // isStagePlayable関数でロック判定（全ステージアンロック対応）
  const isPlayable = isStagePlayable(stageId, previousStageCompleted);
  
  if (isPlayable) {
    // プレイ可能
    card.classList.remove('locked');
    statusIcon.textContent = progress === stage.size ? '✅' : '🎯';
  } else {
    // ロック中
    card.classList.add('locked');
    statusIcon.textContent = '🔒';
  }
}

// ========================================
// ステージ選択
// ========================================
function selectStage(stageId) {
  const stage = STAGES.find(s => s.id === stageId);
  const card = document.querySelector(`.csm-stage-card:nth-child(${stageId})`);
  
  // ロック確認
  if (card.classList.contains('locked')) {
    alert('このステージは前のステージをクリアすると解放されます！');
    return;
  }
  
  currentStage = stageId;
  currentMode = 'reading'; // デフォルトは読み問題
  isReviewMode = false;
  
  console.log(`🎯 Stage ${stageId}: ${stage.name} を選択`);
  
  initializeQuiz();
}

// ========================================
// クイズ初期化
// ========================================
async function initializeQuiz() {
  const stage = STAGES.find(s => s.id === currentStage);
  
  // CSVデータから問題を読み込み（全ステージ対応）
  try {
    const questions = await window.loadStageQuestionsFromCSV(currentStage);
    
    if (questions.length === 0) {
      alert('このステージの問題データがありません。');
      return;
    }
    
    // シャッフルして出題
    currentQuestions = shuffleArray([...questions]);
    console.log(`📚 Stage ${currentStage} (${stage.name}): ${currentQuestions.length}問を出題`);
    
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = [];
    skippedAnswers = [];
    
    showScreen('quizScreen');
    displayQuestion();
    
  } catch (error) {
    console.error('問題データ読み込みエラー:', error);
    alert('問題データの読み込みに失敗しました。');
  }
}

// ========================================
// 問題表示
// ========================================
function displayQuestion() {
  if (currentQuestionIndex >= currentQuestions.length) {
    showResults();
    return;
  }
  
  const question = currentQuestions[currentQuestionIndex];
  const progress = Math.floor(((currentQuestionIndex + 1) / currentQuestions.length) * 100);
  
  // プログレスバー更新
  document.getElementById('quizProgressBar').style.width = progress + '%';
  
  // ステータスバー更新
  updateLearningProgress();
  
  // CSVデータの問題フォーマットを使用（全ステージ対応）
  if (question.questionType) {
    const kanjiEl = document.getElementById('kanjiChar');
    const readingEl = document.getElementById('kanjiReading');
    const questionEl = document.getElementById('questionText');
    
    // 漢字を大きく表示（問題タイプによらず共通）
    kanjiEl.textContent = question.kanji || '';
    readingEl.textContent = '';
    questionEl.textContent = question.question;
    
    // 選択肢をシャッフルして正解位置をランダム化
    const correctAnswer = question.choices[question.correctAnswer];
    const shuffledChoices = shuffleArray([...question.choices]);
    
    displayChoices(shuffledChoices, correctAnswer);
  }
  // 読み問題の表示（従来の形式）
  else if (currentMode === 'reading') {
    document.getElementById('kanjiChar').textContent = question.kanji || question.k;
    document.getElementById('kanjiReading').textContent = '';
    document.getElementById('questionText').textContent = 'この漢字の読み方は？';
    
    // 正解の読み（音読みまたは訓読みの最初の1つ）
    const correctReading = getMainReading(question);
    
    // 選択肢生成
    const choices = generateChoices(correctReading, 'reading');
    displayChoices(choices, correctReading);
  }
  
  // 次へボタンを隠す
  document.getElementById('nextButton').classList.add('hidden');
  
  // 問題報告チェックボックスをリセット
  const reportCheckbox = document.getElementById('questionReportCheckbox');
  if (reportCheckbox) {
    reportCheckbox.checked = false;
    reportCheckbox.dataset.userAnswer = ''; // ユーザー回答を記録
  }
}

// ========================================
// 学習画面ステータスバー更新
// ========================================
function updateLearningProgress() {
  const stage = STAGES.find(s => s.id === currentStage);
  const current = currentQuestionIndex;
  const total = currentQuestions.length;
  const remaining = total - current;
  const percentage = Math.floor((current / total) * 100);
  
  // ステージバッジ更新
  const stageBadge = document.getElementById('stageBadge');
  stageBadge.textContent = `STAGE ${stage.id}: ${stage.name}`;
  stageBadge.className = `csm-stage-badge stage-${stage.id}`;
  
  // 進捗数字更新
  document.getElementById('currentProgress').textContent = current;
  document.getElementById('totalProgress').textContent = total;
  document.getElementById('remainingCount').textContent = `(残り${remaining}問)`;
  
  // ミニプログレスバー更新
  const miniProgressFill = document.getElementById('miniProgressFill');
  miniProgressFill.style.width = percentage + '%';
  document.getElementById('progressPercentage').textContent = percentage + '%';
  
  // プログレス度に応じた色変化
  if (percentage < 30) {
    miniProgressFill.className = 'csm-mini-progress-fill low';
  } else if (percentage < 70) {
    miniProgressFill.className = 'csm-mini-progress-fill medium';
  } else {
    miniProgressFill.className = 'csm-mini-progress-fill high';
  }
}

// ========================================
// メイン読みを取得
// ========================================
function getMainReading(kanji) {
  // 音読みを優先、なければ訓読みの最初の1つ
  if (kanji.onReading) {
    return kanji.onReading.split(',')[0].trim();
  } else if (kanji.kunReading) {
    const kun = kanji.kunReading.split(',')[0].trim();
    // ハイフンを除去
    return kun.replace(/-/g, '');
  }
  return '';
}

// ========================================
// 選択肢生成
// ========================================
function generateChoices(correct, type) {
  const choices = [correct];
  const allKanji = [...window.kanjiData];
  
  while (choices.length < 4) {
    const randomKanji = allKanji[Math.floor(Math.random() * allKanji.length)];
    const randomReading = getMainReading(randomKanji);
    
    if (randomReading && !choices.includes(randomReading)) {
      choices.push(randomReading);
    }
  }
  
  return shuffleArray(choices);
}

// ========================================
// 選択肢表示
// ========================================
function displayChoices(choices, correctAnswer) {
  const container = document.getElementById('choicesContainer');
  container.innerHTML = '';
  
  choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.className = 'csm-choice-button';
    button.textContent = choice;
    button.onclick = () => checkAnswer(choice, correctAnswer, button);
    container.appendChild(button);
  });
}

// ========================================
// 答え合わせ
// ========================================
function checkAnswer(selected, correct, button) {
  const allButtons = document.querySelectorAll('.csm-choice-button');
  const question = currentQuestions[currentQuestionIndex];
  const selectedIndex = Array.from(allButtons).indexOf(button);
  const correctIndex = question.choices ? question.choices.indexOf(correct) : 0;
  const isCorrect = selected === correct;
  
  // すべてのボタンを無効化
  allButtons.forEach(btn => {
    btn.disabled = true;
    btn.style.cursor = 'not-allowed';
  });
  
  // 問題報告チェックボックスの状態を確認
  const reportCheckbox = document.getElementById('questionReportCheckbox');
  if (reportCheckbox && reportCheckbox.checked) {
    saveQuestionReport(question, correctIndex, isCorrect);
  }
  
  if (isCorrect) {
    // 正解
    button.classList.add('correct');
    correctAnswers++;
    
    // ステータスバーを即座に更新（アニメーション付き）
    currentQuestionIndex++;
    updateLearningProgress();
    
    // 0.8秒後に次の問題
    setTimeout(() => {
      displayQuestion();
    }, 800);
    
  } else {
    // 不正解
    button.classList.add('incorrect');
    
    // 正解ボタンをハイライト
    allButtons.forEach(btn => {
      if (btn.textContent === correct) {
        btn.classList.add('correct');
        btn.innerHTML = `${correct}<br><span style="font-size: 14px; opacity: 0.9;">(正解)</span>`;
      }
    });
    
    // 間違えた問題を記録
    wrongAnswers.push(question);
    
    // 次へボタンを表示
    document.getElementById('nextButton').classList.remove('hidden');
  }
}

// ========================================
// スキップ
// ========================================
function skipQuestion() {
  const question = currentQuestions[currentQuestionIndex];
  skippedAnswers.push(question);
  
  currentQuestionIndex++;
  displayQuestion();
}

// ========================================
// 次の問題へ
// ========================================
function nextQuestion() {
  currentQuestionIndex++;
  displayQuestion();
}

// ========================================
// 結果表示
// ========================================
function showResults() {
  const total = currentQuestions.length;
  const incorrect = wrongAnswers.length;
  const skipped = skippedAnswers.length;
  const percentage = Math.floor((correctAnswers / total) * 100);
  
  document.getElementById('resultPercentage').textContent = percentage + '%';
  document.getElementById('correctCount').textContent = correctAnswers;
  document.getElementById('incorrectCount').textContent = incorrect;
  document.getElementById('skippedCount').textContent = skipped;
  
  // 間違い一覧
  if (wrongAnswers.length > 0 || skippedAnswers.length > 0) {
    document.getElementById('wrongListContainer').classList.remove('hidden');
    const wrongList = document.getElementById('wrongList');
    wrongList.innerHTML = '';
    
    [...wrongAnswers, ...skippedAnswers].forEach(k => {
      const span = document.createElement('span');
      span.className = 'csm-wrong-kanji';
      span.textContent = k.kanji || k.k; // Stage 1\u306e\u65b0\u30c7\u30fc\u30bf\u3068\u5f93\u6765\u306e\u30c7\u30fc\u30bf\u4e21\u65b9\u306b\u5bfe\u5fdc\n      wrongList.appendChild(span);
    });
    
    // 復習ボタンを表示
    document.getElementById('reviewButton').classList.remove('hidden');
    
    // LocalStorageに保存
    saveWrongAnswersToStorage();
  } else {
    document.getElementById('wrongListContainer').classList.add('hidden');
    document.getElementById('reviewButton').classList.add('hidden');
  }
  
  // ステージ進捗を更新（正解数を加算）
  if (!isReviewMode) {
    stageProgress[currentStage] = (stageProgress[currentStage] || 0) + correctAnswers;
    const stage = STAGES.find(s => s.id === currentStage);
    
    // 上限を超えないように
    if (stageProgress[currentStage] > stage.size) {
      stageProgress[currentStage] = stage.size;
    }
    
    saveProgress();
  }
  
  showScreen('resultScreen');
}

// ========================================
// もう一度
// ========================================
function restartQuiz() {
  initializeQuiz();
}

// ========================================
// 復習モード
// ========================================
function startReviewMode() {
  const reviewKanji = [...wrongAnswers, ...skippedAnswers];
  
  if (reviewKanji.length === 0) {
    alert('復習する問題がありません！');
    return;
  }
  
  currentQuestions = shuffleArray(reviewKanji);
  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = [];
  skippedAnswers = [];
  isReviewMode = true;
  
  showScreen('quizScreen');
  displayQuestion();
}

// ナビゲーションから復習モード起動
function showReviewFromNav() {
  const savedWrong = getWrongAnswersFromStorage();
  
  if (savedWrong.length === 0) {
    alert('復習する問題がありません！\nまず問題に挑戦してください。');
    return;
  }
  
  // 復習データが Stage 1 フォーマットかどうかを自動判定
  const firstItem = savedWrong[0];
  if (firstItem.stageId) {
    currentStage = firstItem.stageId;
  }
  
  currentQuestions = shuffleArray(savedWrong);
  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = [];
  skippedAnswers = [];
  isReviewMode = true;
  currentMode = 'reading';
  
  showScreen('quizScreen');
  displayQuestion();
}

// ========================================
// 管理者画面
// ========================================

/**
 * 管理者画面を表示
 */
function showAdminScreen() {
  showScreen('adminScreen');
  renderReportsList();
  updateUnlockStatusUI(); // アンロック状態UIを更新
}

/**
 * 報告一覧を描画
 */
function renderReportsList() {
  const reports = getQuestionReports();
  const sortBy = document.getElementById('sortBySelect').value;
  
  // 件数を更新
  document.getElementById('adminReportCount').textContent = reports.length;
  
  // 報告がない場合
  if (reports.length === 0) {
    document.getElementById('noReportsMessage').classList.remove('hidden');
    document.getElementById('reportsTableContainer').classList.add('hidden');
    document.getElementById('exportCSVBtn').disabled = true;
    document.getElementById('clearAllBtn').disabled = true;
    return;
  }
  
  // 報告がある場合
  document.getElementById('noReportsMessage').classList.add('hidden');
  document.getElementById('reportsTableContainer').classList.remove('hidden');
  document.getElementById('exportCSVBtn').disabled = false;
  document.getElementById('clearAllBtn').disabled = false;
  
  // ソート
  const sortedReports = [...reports].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    } else { // stage
      return a.stageId - b.stageId || a.questionId.localeCompare(b.questionId);
    }
  });
  
  // テーブルボディを更新
  const tbody = document.getElementById('reportsTableBody');
  tbody.innerHTML = '';
  
  sortedReports.forEach(report => {
    const tr = document.createElement('tr');
    
    // 報告日時
    const tdDate = document.createElement('td');
    tdDate.textContent = new Date(report.reportedAt).toLocaleString('ja-JP');
    tr.appendChild(tdDate);
    
    // 問題ID
    const tdQuestionId = document.createElement('td');
    tdQuestionId.textContent = report.questionId;
    tr.appendChild(tdQuestionId);
    
    // ステージ
    const tdStage = document.createElement('td');
    tdStage.textContent = report.stageId;
    tr.appendChild(tdStage);
    
    // 漢字
    const tdKanji = document.createElement('td');
    tdKanji.textContent = report.kanji;
    tr.appendChild(tdKanji);
    
    // タイプ
    const tdType = document.createElement('td');
    tdType.textContent = report.questionType;
    tr.appendChild(tdType);
    
    // 問題文（省略表示）
    const tdQuestion = document.createElement('td');
    tdQuestion.className = 'question-cell';
    tdQuestion.title = report.question;
    const questionText = report.question.length > 50 
      ? report.question.substring(0, 50) + '...' 
      : report.question;
    tdQuestion.textContent = questionText;
    tr.appendChild(tdQuestion);
    
    // 正解
    const tdCorrect = document.createElement('td');
    tdCorrect.textContent = report.choices[report.correctAnswer] || '-';
    tr.appendChild(tdCorrect);
    
    // ユーザー回答
    const tdUser = document.createElement('td');
    if (report.userAnswer !== undefined && report.userAnswer !== null) {
      tdUser.textContent = report.choices[report.userAnswer] || '-';
      if (report.isCorrect === false) {
        tdUser.style.color = '#ff6b6b';
      }
    } else {
      tdUser.textContent = '未回答';
      tdUser.style.color = '#999';
    }
    tr.appendChild(tdUser);
    
    // 操作ボタン
    const tdAction = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '削除';
    deleteBtn.onclick = () => confirmDeleteReport(report.id);
    tdAction.appendChild(deleteBtn);
    tr.appendChild(tdAction);
    
    tbody.appendChild(tr);
  });
}

/**
 * 報告削除確認
 */
function confirmDeleteReport(reportId) {
  if (confirm('この報告を削除しますか？')) {
    deleteQuestionReport(reportId);
    renderReportsList();
  }
}

/**
 * 全報告削除確認
 */
function confirmClearAllReports() {
  const reports = getQuestionReports();
  if (reports.length === 0) {
    alert('削除する報告がありません');
    return;
  }
  
  if (confirm(`全ての報告（${reports.length}件）を削除しますか？\nこの操作は取り消せません。`)) {
    clearAllQuestionReports();
    renderReportsList();
  }
}

/**
 * ステータスリセット（学習進捗完全削除）
 */
function handleResetStatus() {
  // 第一確認ダイアログ
  const firstConfirm = confirm(
    '⚠️ 警告: すべての学習進捗がリセットされます。\n\n' +
    '削除されるデータ:\n' +
    '• ステージ進捗（解答済み問題）\n' +
    '• 復習リスト（間違えた問題）\n' +
    '• 問題報告データ\n' +
    '• その他すべての学習記録\n\n' +
    '本当にリセットしますか？'
  );
  
  if (!firstConfirm) {
    console.log('ステータスリセット: キャンセルされました（第一確認）');
    return;
  }
  
  // 第二確認ダイアログ（誤操作防止）
  const secondConfirm = confirm(
    '最終確認: この操作は取り消せません。\n\n' +
    '本当に実行しますか？'
  );
  
  if (!secondConfirm) {
    console.log('ステータスリセット: キャンセルされました（第二確認）');
    return;
  }
  
  try {
    // LocalStorageのデータを削除
    console.log('ステータスリセット開始...');
    
    // 既知のキーを削除
    const knownKeys = [
      STORAGE_KEY_PROGRESS,    // 'csmKanjiProgress'
      STORAGE_KEY_WRONG,       // 'csmKanjiWrong'
      STORAGE_KEY_REPORTS      // 'csmQuestionReports'
    ];
    
    knownKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`削除: ${key}`);
      }
    });
    
    // 念のため、関連キーを全てスキャンして削除
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.toLowerCase().includes('csm') ||
        key.toLowerCase().includes('kanji') || 
        key.toLowerCase().includes('stage') || 
        key.toLowerCase().includes('question') ||
        key.toLowerCase().includes('completion') ||
        key.toLowerCase().includes('report') ||
        key.toLowerCase().includes('wrong') ||
        key.toLowerCase().includes('progress')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`削除（スキャン検出）: ${key}`);
    });
    
    console.log(`✅ ステータスリセット完了: ${knownKeys.length + keysToRemove.length}個のキーを削除`);
    
    alert(
      '✅ ステータスがリセットされました。\n\n' +
      'ホーム画面に戻ります。'
    );
    
    // ホーム画面にリダイレクト（ページリロード）
    window.location.href = window.location.origin + window.location.pathname;
    
  } catch (error) {
    console.error('❌ ステータスリセット中にエラーが発生:', error);
    alert(
      '❌ リセット中にエラーが発生しました。\n\n' +
      'ブラウザのコンソールを確認してください。\n' +
      'エラー: ' + error.message
    );
  }
}

// ========================================
// カード学習機能
// ========================================

window.CARDS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1vPMvHQpzC190LwYTWepPlnDLsRfoT0OkWu4aU_oNipE/export?format=csv&gid=807901471';

let cardsData = [];           // 現在表示しているカードデータ
let allCardsOriginal = [];    // 全カードの元データ（級フィルター用）
let currentCardIdx = 0;
let rememberedCards = [];
let isCardFlipped = false;
let currentGradeFilter = 'all'; // 現在の級フィルター

async function startCardsSession(mode) {
  try {
    console.log('🎴 カードセッション開始処理');
    console.log(`📊 モード: ${mode}`);
    
    // Show loading screen immediately
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('cardsScreen').classList.add('hidden');
    document.getElementById('loadingScreen').classList.remove('hidden');
    
    // Update loading message if element exists
    const loadingTitle = document.querySelector('.csm-loading-title');
    if (loadingTitle) {
      loadingTitle.textContent = 'カードデータ読み込み中...';
    }
    
    const cached = localStorage.getItem('kanjiCardsCache');
    const cacheTime = localStorage.getItem('kanjiCardsCacheTime');
    const now = Date.now();
    
    if (cached && cacheTime && (now - parseInt(cacheTime)) < 1800000) {
      try {
        cardsData = JSON.parse(cached);
        console.log(`📦 キャッシュからカードデータ読み込み: ${cardsData.length}枚`);
        
        // Validate cached data
        if (!Array.isArray(cardsData) || cardsData.length === 0) {
          console.warn('⚠️ キャッシュデータが無効です。再取得します。');
          localStorage.removeItem('kanjiCardsCache');
          localStorage.removeItem('kanjiCardsCacheTime');
          throw new Error('INVALID_CACHE'); // Trigger fresh fetch
        }
      } catch (cacheError) {
        if (cacheError.message === 'INVALID_CACHE') {
          throw cacheError; // Re-throw to trigger fresh fetch
        }
        console.error('❌ キャッシュ読み込みエラー:', cacheError);
        localStorage.removeItem('kanjiCardsCache');
        localStorage.removeItem('kanjiCardsCacheTime');
        // Continue to fresh fetch
      }
    }
    
    // If cache was invalid or doesn't exist, fetch fresh data
    if (!cardsData || cardsData.length === 0) {
      console.log('🌐 Google Spreadsheetからカードデータ取得中...');
      console.log(`📍 URL: ${window.CARDS_SHEET_URL}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒タイムアウト
      
      try {
        const res = await fetch(window.CARDS_SHEET_URL, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const csv = await res.text();
        console.log(`📄 CSV取得完了: ${csv.length}文字`);
        
        // Validate CSV structure
        if (!csv || csv.trim().length === 0) {
          throw new Error('CSV_EMPTY: Spreadsheetが空です');
        }
        
        const lines = csv.split('\n').slice(1).filter(l => l.trim());
        console.log(`📋 CSVから${lines.length}行を抽出`);
        
        if (lines.length === 0) {
          throw new Error('CSV_NO_DATA: ヘッダー行のみでデータがありません');
        }
        
        console.log('📝 最初の3行をプレビュー:');
        lines.slice(0, 3).forEach((line, i) => {
          console.log(`  行${i + 1}: ${line.substring(0, 100)}${line.length > 100 ? '...' : ''}`);
        });
        
        cardsData = lines.map((l, index) => {
          const parts = l.split(',').map(p => p.trim());
          
          // Validate required fields
          if (!parts[1] || !parts[2]) {
            console.warn(`⚠️ 行${index + 1}にwordまたはhiddenが欠落:`, parts);
          }
          
          const card = { 
            id: parts[0] || `card-${index + 1}`, 
            word: parts[1] || '???', 
            hidden: parts[2] || '?', 
            reading: parts[3] || 'カナ',
            grade: parts[4] || '10', 
            category: parts[5] || 'unknown'
          };
          
          if (index < 3) {
            console.log(`📇 カード${index + 1}:`, card);
          }
          return card;
        });
        
        // Final validation
        const validCards = cardsData.filter(c => c.word && c.word !== '???');
        if (validCards.length === 0) {
          throw new Error('VALIDATION_FAILED: 有効なカードが1枚もありません');
        }
        if (validCards.length < cardsData.length) {
          console.warn(`⚠️ ${cardsData.length - validCards.length}枚の無効なカードをスキップしました`);
          cardsData = validCards;
        }
        
        // Cache the validated data
        try {
          localStorage.setItem('kanjiCardsCache', JSON.stringify(cardsData));
          localStorage.setItem('kanjiCardsCacheTime', now.toString());
          console.log(`💾 キャッシュ保存成功: ${cardsData.length}枚`);
        } catch (storageError) {
          console.warn('⚠️ localStorageへの保存失敗:', storageError.message);
          // Continue without caching
        }
        
        console.log(`✅ カードデータ読み込み完了: ${cardsData.length}枚`);
      } catch (fetchError) {
        console.error('❌ フェッチエラー詳細:', fetchError);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('TIMEOUT: データ取得に15秒以上かかりました。ネットワーク接続を確認してください。');
        }
        if (fetchError.message.includes('Failed to fetch')) {
          throw new Error('NETWORK_ERROR: ネットワークに接続できません。インターネット接続を確認してください。');
        }
        throw fetchError;
      }
    }
    
    // Final validation before starting session
    if (!cardsData || !Array.isArray(cardsData) || cardsData.length === 0) {
      console.error('❌ カードデータが無効:', { 
        exists: !!cardsData, 
        isArray: Array.isArray(cardsData), 
        length: cardsData?.length 
      });
      throw new Error('DATA_INVALID: カードデータが読み込めませんでした');
    }
    
    console.log(`✅ カードデータ確認: ${cardsData.length}枚`);
    console.log('📇 最初のカード:', cardsData[0]);
    console.log('📇 最後のカード:', cardsData[cardsData.length - 1]);
    
    // 元データを保存（級フィルター用）
    allCardsOriginal = [...cardsData];
    currentGradeFilter = 'all';
    
    currentCardIdx = 0;
    rememberedCards = [];
    isCardFlipped = false;
    console.log(`🎴 カードセッション開始: ${cardsData.length}枚`);
    
    // 級フィルターボタンをリセット
    document.querySelectorAll('.grade-filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    const allBtn = document.querySelector('[data-grade="all"]');
    if (allBtn) {
      allBtn.classList.add('active');
    }
    
    // 先に画面を表示
    showCardsScreen();
    
    // DOM要素が完全にレンダリングされるまで待機（500msに延長）
    setTimeout(() => {
      console.log('⏰ 遅延実行開始（500ms後）');
      
      // 要素の存在を再確認
      const cardsScreen = document.getElementById('cardsScreen');
      const cardFront = document.getElementById('cardFront');
      
      console.log('🔍 cardsScreen:', cardsScreen);
      console.log('🔍 cardFront:', cardFront);
      console.log('🔍 cardsScreen.classList:', cardsScreen?.classList.toString());
      
      resetCardState();
      displayCurrentCard();
    }, 500);
    
  } catch (err) {
    console.error('❌ カードロードエラー:', err);
    console.error('📊 エラータイプ:', err.name);
    console.error('📝 エラーメッセージ:', err.message);
    console.error('📚 スタック:', err.stack);
    
    // Enhanced error messages with troubleshooting
    let errorMsg = '⚠️ カードデータの読み込みに失敗しました\n\n';
    let troubleshooting = '';
    
    const errMsg = err.message;
    
    if (errMsg.includes('TIMEOUT') || errMsg.includes('タイムアウト')) {
      errorMsg += '原因: データ取得がタイムアウトしました';
      troubleshooting = '\n\n対処法:\n• Wi-Fi/モバイル接続を確認\n• ページをリロードして再試行\n• Spreadsheetが公開設定か確認';
    } else if (errMsg.includes('NETWORK_ERROR')) {
      errorMsg += '原因: ネットワーク接続エラー';
      troubleshooting = '\n\n対処法:\n• インターネット接続を確認\n• VPNを無効にして再試行\n• ファイアウォール設定を確認';
    } else if (errMsg.includes('HTTP 403')) {
      errorMsg += '原因: Spreadsheetへのアクセスが拒否されました';
      troubleshooting = '\n\n対処法:\n• Spreadsheetの共有設定を確認\n• 「リンクを知っている全員」に変更\n• gidが正しいか確認';
    } else if (errMsg.includes('HTTP 404')) {
      errorMsg += '原因: Spreadsheetが見つかりません';
      troubleshooting = '\n\n対処法:\n• Spreadsheet IDが正しいか確認\n• URLが削除されていないか確認';
    } else if (errMsg.includes('CSV_EMPTY') || errMsg.includes('CSV_NO_DATA')) {
      errorMsg += '原因: Spreadsheetにデータがありません';
      troubleshooting = '\n\n対処法:\n• 「単語カード」シート(gid=807901471)を確認\n• 最低1行のデータが必要\n• ヘッダー行の下にデータがあるか確認';
    } else if (errMsg.includes('VALIDATION_FAILED')) {
      errorMsg += '原因: データ形式が不正です';
      troubleshooting = '\n\n対処法:\n• word列とhidden列が必須\n• CSVフォーマットを確認\n• カンマ区切りが正しいか確認';
    } else if (errMsg.includes('DATA_INVALID')) {
      errorMsg += '原因: データが読み込めませんでした';
      troubleshooting = '\n\n対処法:\n• キャッシュをクリアして再試行\n• ブラウザのコンソールログを確認';
    } else if (errMsg.includes('INVALID_CACHE')) {
      errorMsg += '原因: キャッシュデータが破損しています';
      troubleshooting = '\n\n対処法:\n• 自動的に再取得します\n• もう一度CARDボタンをクリック';
    } else {
      errorMsg += `原因: ${err.message}`;
      troubleshooting = '\n\n対処法:\n• ブラウザのコンソールを確認\n• ページをリロードして再試行';
    }
    
    errorMsg += troubleshooting;
    
    alert(errorMsg);
    
    // Clear potentially corrupted cache
    if (!errMsg.includes('NETWORK') && !errMsg.includes('TIMEOUT')) {
      console.log('🧹 キャッシュをクリア');
      localStorage.removeItem('kanjiCardsCache');
      localStorage.removeItem('kanjiCardsCacheTime');
    }
    
    // Return to home screen
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('cardsScreen').classList.add('hidden');
    document.getElementById('homeScreen').classList.remove('hidden');
  }
}

function showCardsScreen() {
  console.log('🎴 カード画面を表示');
  
  try {
    // 全ての画面を非表示
    document.getElementById('homeScreen')?.classList.add('hidden');
    document.getElementById('loadingScreen')?.classList.add('hidden');
    document.getElementById('errorScreen')?.classList.add('hidden');
    
    // カード画面を表示
    const cardsScreen = document.getElementById('cardsScreen');
    if (!cardsScreen) {
      console.error('❌ cardsScreen 要素が見つかりません');
      alert('エラー: カード画面が見つかりません。HTMLを確認してください。');
      return;
    }
    
    cardsScreen.classList.remove('hidden');
    
    // 強制的に再描画をトリガー
    cardsScreen.offsetHeight;
    
    console.log('✅ カード画面表示完了');
    console.log('🔍 cardsScreen.classList:', cardsScreen.classList.toString());
    
  } catch (error) {
    console.error('❌ showCardsScreen エラー:', error);
  }
}

function exitCards() {
  console.log('🏠 ホーム画面に戻る');
  document.getElementById('cardsScreen').classList.add('hidden');
  document.getElementById('homeScreen').classList.remove('hidden');
}

function renderVerticalText(text) {
  return text.split('').map(char => {
    // カタカナのみに縦線を適用（全角カタカナのみ判定）
    const isKatakana = /[ァ-ヴー]/.test(char);
    
    if (isKatakana) {
      return `<span class="katakana-with-line">${char}<span class="vertical-line"></span></span>`;
    }
    // 漢字、ひらがな、その他はそのまま
    return `<span>${char}</span>`;
  }).join('');
}

function displayCurrentCard() {
  try {
    console.log('📇 カード表示開始');
    
    // セッション完了チェック
    if (currentCardIdx >= cardsData.length) {
      showCardsComplete();
      return;
    }
    
    // データチェック
    if (!cardsData || cardsData.length === 0) {
      console.error('❌ cardsData が空です');
      alert('カードデータがありません');
      return;
    }
    
    const card = cardsData[currentCardIdx];
    console.log(`📇 カード表示: ${currentCardIdx + 1}/${cardsData.length} - ${card.word}`);
    
    // 親要素の確認
    const cardsScreen = document.getElementById('cardsScreen');
    console.log('🔍 親要素 cardsScreen:', cardsScreen);
    console.log('🔍 cardsScreen.style.display:', cardsScreen?.style.display);
    console.log('🔍 cardsScreen.classList:', cardsScreen?.classList.toString());
    
    // 要素の存在チェック（安全な取得）
    console.log('🔍 要素を取得中...');
    const elements = {
      cardFront: document.getElementById('cardFront'),
      cardBack: document.getElementById('cardBack'),
      cardGradeFront: document.getElementById('cardGradeFront'),
      cardGradeBack: document.getElementById('cardGradeBack'),
      cardProgress: document.getElementById('cardProgress')
    };
    
    // 詳細なログ
    console.log('🔍 取得した要素:', elements);
    
    // 要素が存在しない場合はエラーログを出力
    for (const [key, element] of Object.entries(elements)) {
      if (!element) {
        console.error(`❌ 要素が見つかりません: ${key}`);
        console.error(`🔍 document.getElementById('${key}'):`, document.getElementById(key));
        
        // HTML構造をログに出力
        if (cardsScreen) {
          console.error('🔍 cardsScreen.innerHTML の最初の500文字:', cardsScreen.innerHTML.substring(0, 500));
        }
        
        alert(`エラー: HTML要素が見つかりません (${key})\n\nブラウザのコンソールを確認してください。`);
        return;
      }
    }
    
    // CSVのreadingフィールドを使用してカタカナ変換
    const reading = card.reading || 'カナ';
    
    // データの検証と修正
    let wordWithSquare = card.word;
    let katakanaText;
    let answerText;
    
    if (card.word.includes('□')) {
      // 正常なデータ: □が含まれている
      katakanaText = card.word.replace('□', reading);
      answerText = card.word.replace('□', card.hidden);
    } else if (card.word.includes(reading)) {
      // データ異常: 既にカタカナが入っている
      console.warn('⚠️ データ異常: card.wordに既にカタカナが含まれています');
      console.warn('  修正前:', card.word);
      
      // カタカナを□に戻してから処理
      wordWithSquare = card.word.replace(reading, '□');
      console.warn('  修正後:', wordWithSquare);
      
      katakanaText = card.word; // 既にカタカナが入っている
      answerText = card.word.replace(reading, card.hidden); // カタカナを漢字に置換
    } else {
      // フォールバック: そのまま使用
      console.warn('⚠️ データ形式が不明です');
      katakanaText = card.word;
      answerText = card.word;
    }
    
    console.log('🔍 デバッグ情報:');
    console.log('  card.word:', card.word);
    console.log('  card.hidden:', card.hidden);
    console.log('  card.reading:', card.reading);
    console.log('  wordWithSquare:', wordWithSquare);
    console.log('  katakanaText（表面）:', katakanaText);
    console.log('  answerText（裏面）:', answerText);
    
    // 要素に値を設定
    elements.cardFront.innerHTML = renderVerticalText(katakanaText);
    elements.cardBack.innerHTML = renderVerticalText(answerText); // 修正：カタカナを漢字に置換
    elements.cardGradeFront.textContent = `${card.grade}級`;
    elements.cardGradeBack.textContent = `${card.grade}級`;
    elements.cardProgress.textContent = `${currentCardIdx + 1} / ${cardsData.length}`;
    
    console.log('✅ カード表示完了');
    
    // チェックボックスの状態を更新
    updateCardReportCheckbox();
    
  } catch (error) {
    console.error('❌ displayCurrentCard エラー:', error);
    alert('カード表示エラー: ' + error.message + '\nページをリロードしてください。');
  }
}

function flipTheCard() {
  try {
    const cardEl = document.getElementById('cardInner');
    const btnShowAnswer = document.getElementById('showAnswerBtn');
    const choiceButtons = document.getElementById('cardChoiceButtons');
    
    if (!cardEl || !btnShowAnswer || !choiceButtons) {
      console.error('❌ フリップに必要な要素が見つかりません');
      return;
    }
    
    cardEl.classList.add('flipped');
    isCardFlipped = true;
    
    btnShowAnswer.style.display = 'none';
    choiceButtons.style.display = 'block';
    
    console.log('✅ カードをフリップしました');
    
  } catch (error) {
    console.error('❌ flipTheCard エラー:', error);
  }
}

function markCardRemembered() {
  rememberedCards.push(cardsData[currentCardIdx].id);
  goToNextCard();
}

function markCardNotRemembered() {
  goToNextCard();
}

function goToNextCard() {
  console.log(`➡️ 次のカードへ: ${currentCardIdx} → ${currentCardIdx + 1}`);
  currentCardIdx++;
  if (currentCardIdx >= cardsData.length) {
    showCardsComplete();
    return;
  }
  resetCardState();
  displayCurrentCard();
}

function goToPreviousCard() {
  if (currentCardIdx > 0) {
    currentCardIdx--;
    resetCardState();
    displayCurrentCard();
  }
}

function resetCardState() {
  try {
    console.log('🔄 カード状態をリセット');
    
    const cardEl = document.getElementById('cardInner');
    const btnShowAnswer = document.getElementById('showAnswerBtn');
    const choiceButtons = document.getElementById('cardChoiceButtons');
    
    if (!cardEl || !btnShowAnswer || !choiceButtons) {
      console.error('❌ リセットに必要な要素が見つかりません');
      return;
    }
    
    cardEl.classList.remove('flipped');
    isCardFlipped = false;
    
    btnShowAnswer.style.display = 'block';
    choiceButtons.style.display = 'none';
    
    console.log('✅ カード状態リセット完了');
    
  } catch (error) {
    console.error('❌ resetCardState エラー:', error);
  }
}

function showCardsComplete() {
  const rate = Math.round((rememberedCards.length / cardsData.length) * 100);
  alert(
    `セッション完了！\n\n` +
    `覚えたカード: ${rememberedCards.length}/${cardsData.length}\n` +
    `達成率: ${rate}%`
  );
  exitCards();
}

// ========================================
// 🔧 EXPOSE CARD FUNCTIONS TO GLOBAL SCOPE
// ========================================
// Ensure all card-related functions are accessible from HTML onclick attributes
window.startCardsSession = startCardsSession;
window.showCardsScreen = showCardsScreen;
window.displayCurrentCard = displayCurrentCard;
window.flipTheCard = flipTheCard;
window.goToNextCard = goToNextCard;
window.goToPreviousCard = goToPreviousCard;
window.markCardRemembered = markCardRemembered;
window.markCardNotRemembered = markCardNotRemembered;
window.resetCardState = resetCardState;
window.exitCards = exitCards;
window.showCardsComplete = showCardsComplete;

console.log('✅ All card functions exposed to global scope');

// ========================================
// 級フィルター機能
// ========================================

/**
 * 級別にカードをフィルタリング
 * @param {string} grade - 級（'all', '10', '9', '8', '7'）
 */
function filterCardsByGrade(grade) {
  try {
    console.log('🎯 級フィルター:', grade);
    
    currentGradeFilter = grade;
    
    // アクティブボタンの切り替え
    document.querySelectorAll('.grade-filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-grade="${grade}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
    
    // カードをフィルタリング
    if (grade === 'all') {
      cardsData = [...allCardsOriginal];
    } else {
      // gradeは文字列として比較
      cardsData = allCardsOriginal.filter(card => card.grade === String(grade));
    }
    
    console.log(`✅ フィルター後のカード数: ${cardsData.length}枚`);
    
    if (cardsData.length === 0) {
      alert(`${grade}級のカードがありません`);
      // フィルター前の状態に戻す
      cardsData = [...allCardsOriginal];
      currentGradeFilter = 'all';
      document.querySelectorAll('.grade-filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelector('[data-grade="all"]')?.classList.add('active');
      return;
    }
    
    // 最初のカードから再開
    currentCardIdx = 0;
    rememberedCards = [];
    resetCardState();
    displayCurrentCard();
    
  } catch (error) {
    console.error('❌ filterCardsByGrade エラー:', error);
    alert('級フィルターエラー: ' + error.message);
  }
}

// グローバルスコープに公開
window.filterCardsByGrade = filterCardsByGrade;

// ========================================
// カード問題報告機能
// ========================================

const CARD_REPORTS_KEY = 'kanjiCardReports'; // LocalStorageキー

/**
 * チェックボックスの状態管理
 */
function handleCardReportToggle() {
  try {
    const checkbox = document.getElementById('card-report-checkbox');
    
    if (!checkbox) {
      console.error('❌ チェックボックスが見つかりません');
      return;
    }
    
    const isChecked = checkbox.checked;
    const currentCard = cardsData[currentCardIdx];
    
    if (!currentCard) {
      console.error('❌ 現在のカードが見つかりません');
      return;
    }
    
    if (isChecked) {
      addCardReport(currentCard);
      console.log('📝 問題報告を追加:', currentCard.id);
    } else {
      removeCardReport(currentCard.id);
      console.log('🗑️ 問題報告を削除:', currentCard.id);
    }
  } catch (error) {
    console.error('❌ handleCardReportToggle エラー:', error);
  }
}

/**
 * 問題報告を追加
 */
function addCardReport(card) {
  try {
    const reports = JSON.parse(localStorage.getItem(CARD_REPORTS_KEY) || '[]');
    
    // 既に報告済みかチェック
    if (reports.some(r => r.id === card.id)) {
      console.log('⚠️ 既に報告済み:', card.id);
      return;
    }
    
    reports.push({
      id: card.id,
      word: card.word,
      hidden: card.hidden,
      reading: card.reading,
      grade: card.grade,
      category: card.category,
      reportedAt: Date.now()
    });
    
    localStorage.setItem(CARD_REPORTS_KEY, JSON.stringify(reports));
    console.log('✅ 問題報告を保存しました');
  } catch (error) {
    console.error('❌ addCardReport エラー:', error);
  }
}

/**
 * 問題報告を削除
 */
function removeCardReport(cardId) {
  try {
    let reports = JSON.parse(localStorage.getItem(CARD_REPORTS_KEY) || '[]');
    reports = reports.filter(r => r.id !== cardId);
    localStorage.setItem(CARD_REPORTS_KEY, JSON.stringify(reports));
    console.log('✅ 問題報告を削除しました');
  } catch (error) {
    console.error('❌ removeCardReport エラー:', error);
  }
}

/**
 * 現在のカードが報告済みかチェック
 */
function isCardReported(cardId) {
  try {
    const reports = JSON.parse(localStorage.getItem(CARD_REPORTS_KEY) || '[]');
    return reports.some(r => r.id === cardId);
  } catch (error) {
    console.error('❌ isCardReported エラー:', error);
    return false;
  }
}

/**
 * チェックボックスの状態を更新（カード表示時に呼び出す）
 */
function updateCardReportCheckbox() {
  try {
    const checkbox = document.getElementById('card-report-checkbox');
    
    if (!checkbox) {
      return;
    }
    
    const currentCard = cardsData[currentCardIdx];
    
    if (!currentCard) {
      return;
    }
    
    checkbox.checked = isCardReported(currentCard.id);
  } catch (error) {
    console.error('❌ updateCardReportCheckbox エラー:', error);
  }
}

/**
 * カード問題報告CSV出力
 */
function exportCardReportsCSV() {
  try {
    const reports = JSON.parse(localStorage.getItem(CARD_REPORTS_KEY) || '[]');
    
    if (reports.length === 0) {
      alert('報告された問題はありません');
      return;
    }
    
    // CSVヘッダー（BOM付きUTF-8）
    let csv = '\uFEFF'; // BOM
    csv += 'id,word,hidden,reading,grade,category,reportedAt\n';
    
    // データ行
    reports.forEach(report => {
      const date = new Date(report.reportedAt).toLocaleString('ja-JP');
      csv += `${report.id},"${report.word}","${report.hidden}","${report.reading}",${report.grade},"${report.category}","${date}"\n`;
    });
    
    // ダウンロード
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `kanji-card-reports-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`✅ カード問題報告CSV出力完了: ${reports.length}件`);
    alert(`✅ ${reports.length}件の問題報告をダウンロードしました`);
  } catch (error) {
    console.error('❌ exportCardReportsCSV エラー:', error);
    alert('CSV出力エラー: ' + error.message);
  }
}

// グローバルスコープに公開
window.handleCardReportToggle = handleCardReportToggle;
window.exportCardReportsCSV = exportCardReportsCSV;

// ========================================
// 問題データ更新機能
// ========================================

/**
 * 問題データ更新（キャッシュクリア＆再読み込み）
 */
function handleRefreshQuestions() {
  const confirm1 = confirm(
    '🔄 最新の問題データを取得します。\n\n' +
    'Google Spreadsheetから最新データを読み込み、\n' +
    '現在のキャッシュがクリアされます。\n\n' +
    '続行しますか？'
  );
  
  if (!confirm1) {
    console.log('問題データ更新: キャンセルされました');
    return;
  }
  
  try {
    console.log('🔄 問題データ更新を実行中...');
    
    // キャッシュをクリア
    if (typeof window.clearQuestionsCache === 'function') {
      window.clearQuestionsCache();
      console.log('✅ キャッシュをクリアしました');
    } else {
      console.warn('⚠️ clearQuestionsCache関数が見つかりません');
    }
    
    alert(
      '✅ キャッシュをクリアしました。\n\n' +
      'ページをリロードして最新データを取得します。'
    );
    
    // ページリロード
    window.location.reload();
    
  } catch (error) {
    console.error('❌ 問題データ更新エラー:', error);
    alert(
      '❌ エラーが発生しました。\n\n' +
      'ブラウザのコンソールを確認してください。\n' +
      'エラー: ' + error.message
    );
  }
}

/**
 * 全ステージアンロック処理
 */
function handleUnlockAll() {
  const confirm1 = confirm(
    '全ステージをアンロックしますか？\n\n' +
    '⚠️ この操作により、Stage 1-10のすべてが即座にプレイ可能になります。\n' +
    'テストや特別な用途にのみ使用してください。'
  );
  
  if (!confirm1) {
    console.log('全ステージアンロック: キャンセルされました');
    return;
  }
  
  try {
    unlockAllStages();
    updateUnlockStatusUI();
    alert(
      '✅ 全ステージをアンロックしました！\n\n' +
      'ステージ選択画面に戻って確認してください。'
    );
  } catch (error) {
    console.error('❌ アンロックエラー:', error);
    alert('❌ エラーが発生しました');
  }
}

/**
 * 通常のロック状態に戻す処理
 */
function handleLockAll() {
  const confirm1 = confirm(
    '通常のロック状態に戻しますか？\n\n' +
    '⚠️ この操作により、ステージの進行制御が通常モードに戻ります。\n' +
    '（前のステージをクリアしないと次に進めない状態）'
  );
  
  if (!confirm1) {
    console.log('ロック処理: キャンセルされました');
    return;
  }
  
  try {
    lockAllStages();
    updateUnlockStatusUI();
    alert(
      '✅ 通常のロック状態に戻しました。\n\n' +
      'ステージ選択画面に戻って確認してください。'
    );
  } catch (error) {
    console.error('❌ ロックエラー:', error);
    alert('❌ エラーが発生しました');
  }
}

/**
 * アンロック状態UIを更新
 */
function updateUnlockStatusUI() {
  const isUnlocked = isAllStagesUnlocked();
  
  const statusText = document.getElementById('unlockStatusText');
  const statusBadge = document.getElementById('unlockStatusBadge');
  const statusDesc = document.getElementById('unlockStatusDesc');
  const unlockBtn = document.getElementById('unlockAllBtn');
  const lockBtn = document.getElementById('lockAllBtn');
  
  if (isUnlocked) {
    // アンロック中
    if (statusText) statusText.textContent = '🔓 全ステージアンロック中';
    if (statusBadge) {
      statusBadge.textContent = 'テストモード';
      statusBadge.className = 'unlock-status-badge unlocked';
    }
    if (statusDesc) {
      statusDesc.textContent = '現在、全ステージ（Stage 1-10）がアンロックされています。進捗に関係なくすべてのステージをプレイできます。';
    }
    if (unlockBtn) unlockBtn.disabled = true;
    if (lockBtn) lockBtn.disabled = false;
  } else {
    // 通常モード
    if (statusText) statusText.textContent = '🔒 通常モード';
    if (statusBadge) {
      statusBadge.textContent = '順次解放';
      statusBadge.className = 'unlock-status-badge locked';
    }
    if (statusDesc) {
      statusDesc.textContent = '通常モードです。前のステージをクリアすると次のステージが解放されます。';
    }
    if (unlockBtn) unlockBtn.disabled = false;
    if (lockBtn) lockBtn.disabled = true;
  }
}

/**
 * CSV出力
 */
function exportReportsCSV() {
  const csvContent = exportReportsToCSV();
  
  if (!csvContent) {
    alert('エクスポートする報告がありません');
    return;
  }
  
  // BOM付きUTF-8で出力（Excel対応）
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // ファイル名: question-reports-YYYY-MM-DD.csv
  const today = new Date().toISOString().slice(0, 10);
  link.download = `question-reports-${today}.csv`;
  
  link.click();
  URL.revokeObjectURL(url);
  
  console.log('📊 CSV exported:', link.download);
}

// ========================================
// ユーティリティ関数
// ========================================
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
