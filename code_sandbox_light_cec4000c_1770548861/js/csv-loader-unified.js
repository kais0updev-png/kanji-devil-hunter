// ========================================
// CSVデータローダー - Google Spreadsheet連携版
// Google Sheetsから動的に問題データを読み込み
// ========================================

// 定数定義
const QUESTIONS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1vPMvHQpzC190LwYTWepPlnDLsRfoT0OkWu4aU_oNipE/export?format=csv&gid=0';
const CACHE_KEY = 'kanjiQuestionsCache';
const CACHE_TIMESTAMP_KEY = 'kanjiQuestionsCacheTimestamp';
const CACHE_DURATION = 1000 * 60 * 30; // 30分キャッシュ

// グローバルキャッシュ
window.allQuestionsCache = null; // 全問題を一度だけ読み込む
window.stageQuestionsCache = {}; // ステージ別にフィルタされた問題

/**
 * 統合CSVファイルを読み込んで問題データに変換
 * @param {number} stageId - ステージID (1-10)
 * @returns {Promise<Array>} - 問題データ配列
 */
async function loadStageQuestionsFromCSV(stageId) {
  // ステージ別キャッシュがあれば返す
  if (window.stageQuestionsCache[stageId]) {
    console.log(`📦 Stage ${stageId}: キャッシュから読み込み (${window.stageQuestionsCache[stageId].length}問)`);
    return window.stageQuestionsCache[stageId];
  }

  // 全問題をまだ読み込んでいない場合は読み込む
  if (!window.allQuestionsCache) {
    await loadAllQuestions();
  }

  // ステージIDでフィルタ
  const stageQuestions = window.allQuestionsCache.filter(q => q.stageId === stageId);
  
  // ステージ別キャッシュに保存
  window.stageQuestionsCache[stageId] = stageQuestions;

  console.log(`📚 Stage ${stageId}: ${stageQuestions.length}問を読み込みました`);
  return stageQuestions;
}

/**
 * 統合CSVから全問題を一度に読み込む（Google Spreadsheet対応）
 * @returns {Promise<void>}
 */
async function loadAllQuestions() {
  try {
    // ローカルストレージのキャッシュをチェック
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (cachedData && cachedTimestamp) {
      const age = Date.now() - parseInt(cachedTimestamp);
      if (age < CACHE_DURATION) {
        const questions = JSON.parse(cachedData);
        window.allQuestionsCache = questions;
        
        console.log('📦 キャッシュから問題データを読み込みました:');
        console.log(`   総問題数: ${questions.length}問`);
        console.log(`   キャッシュ経過時間: ${Math.floor(age / 1000 / 60)}分`);
        
        // ステージ別問題数を表示
        logStageCounts(questions);
        return;
      } else {
        console.log('⏰ キャッシュの有効期限が切れました。新しいデータを取得します...');
      }
    }
    
    console.log('🌐 Google Spreadsheetから問題データを取得中...');
    console.log(`   URL: ${QUESTIONS_SHEET_URL}`);
    
    const response = await fetch(QUESTIONS_SHEET_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    const questions = parseUnifiedCSV(csvText);

    // グローバルキャッシュに保存
    window.allQuestionsCache = questions;
    
    // LocalStorageにキャッシュ保存
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(questions));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      console.log('💾 キャッシュに保存しました（有効期限: 30分）');
    } catch (e) {
      console.warn('⚠️ LocalStorageへの保存に失敗しました（容量不足の可能性）:', e);
    }

    console.log('✅ Google Spreadsheetからデータを読み込みました:');
    console.log(`   総問題数: ${questions.length}問`);
    
    // ステージ別問題数をログ出力
    logStageCounts(questions);

  } catch (error) {
    console.error('❌ 問題データの読み込みエラー:', error);
    
    // フォールバック: 古いキャッシュがあれば使用
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      console.log('⚠️ エラー発生。古いキャッシュデータを使用します');
      const questions = JSON.parse(cachedData);
      window.allQuestionsCache = questions;
      console.log(`   総問題数: ${questions.length}問（キャッシュ）`);
    } else {
      console.error('💥 キャッシュもありません。問題データの読み込みに失敗しました。');
      window.allQuestionsCache = [];
      throw new Error('問題データの読み込みに失敗しました。インターネット接続を確認してください。');
    }
  }
}

/**
 * ステージ別問題数をログ出力
 * @param {Array} questions - 問題データ配列
 */
function logStageCounts(questions) {
  const stageCounts = {};
  questions.forEach(q => {
    stageCounts[q.stageId] = (stageCounts[q.stageId] || 0) + 1;
  });
  
  Object.keys(stageCounts).sort((a, b) => parseInt(a) - parseInt(b)).forEach(stageId => {
    console.log(`   Stage ${stageId}: ${stageCounts[stageId]}問`);
  });
}

/**
 * 統合CSVテキストを問題データに変換
 * @param {string} csvText - CSVテキスト
 * @returns {Array} - 問題データ配列
 */
function parseUnifiedCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const questions = [];

  // ヘッダー行をスキップ（1行目）
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // CSVパース（カンマ区切り、ダブルクォート対応）
    const columns = parseCSVLine(line);

    if (columns.length < 12) {
      console.warn(`⚠️ ${i+1}行目: カラム数が不足 (${columns.length})`);
      continue;
    }

    const question = {
      id: columns[0],                    // s1-q001
      stageId: parseInt(columns[1]),     // 1
      kanji: columns[2],                 // 一
      grade: parseInt(columns[3]),       // 1
      questionType: columns[4],          // reading
      question: columns[5],              // 「一」の読み方を選びなさい。
      choices: [
        columns[6],                      // choice1
        columns[7],                      // choice2
        columns[8],                      // choice3
        columns[9]                       // choice4
      ],
      correctAnswer: parseInt(columns[10]), // 0 (0-based index)
      explanation: columns[11]           // 一は「いち」「ひと（つ）」と読みます
    };

    questions.push(question);
  }

  return questions;
}

/**
 * CSV行をパース（カンマ区切り、ダブルクォート対応）
 * @param {string} line - CSV行
 * @returns {Array<string>} - カラム配列
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current); // 最後のカラム
  return result;
}

/**
 * 問題データキャッシュをクリア（最新データを強制取得するため）
 */
function clearQuestionsCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  window.allQuestionsCache = null;
  window.stageQuestionsCache = {};
  console.log('🗑️ 問題データキャッシュをクリアしました');
}

// グローバルエクスポート
window.loadStageQuestionsFromCSV = loadStageQuestionsFromCSV;
window.loadAllQuestions = loadAllQuestions;
window.clearQuestionsCache = clearQuestionsCache;
window.QUESTIONS_SHEET_URL = QUESTIONS_SHEET_URL;
