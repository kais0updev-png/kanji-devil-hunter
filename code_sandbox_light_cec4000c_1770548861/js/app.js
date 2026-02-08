// グローバル変数
let currentMode = '';
let currentQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = [];
let skippedAnswers = [];
let isReviewMode = false;
let selectedLevel = 'all'; // 'all', 10, 9, 8, 7

// ローカルストレージのキー
const STORAGE_KEY = 'kanjiQuiz_wrongAnswers';

// 難易度レベル設定
function setLevel(level) {
    selectedLevel = level;
    
    // すべてのレベルボタンのスタイルをリセット
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.className = 'level-btn bg-gray-200 text-gray-700 rounded-xl py-4 px-6 font-bold text-lg shadow-lg transition transform hover:scale-105';
    });
    
    // 選択されたボタンを強調表示
    const btnId = level === 'all' ? 'levelAll' : `level${level}`;
    const selectedBtn = document.getElementById(btnId);
    if (selectedBtn) {
        selectedBtn.className = 'level-btn bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl py-4 px-6 font-bold text-lg shadow-lg transition transform hover:scale-105';
    }
    
    // 出題数を表示
    const filteredKanji = getFilteredKanji();
    document.getElementById('levelAll').innerHTML = `すべて<br><span class="text-sm opacity-90">(${window.kanjiData.length}もん)</span>`;
    if (level !== 'all') {
        console.log(`選択: ${level}級 - ${filteredKanji.length}字`);
    }
}

// レベルに応じて漢字をフィルタリング
function getFilteredKanji() {
    if (selectedLevel === 'all') {
        return window.kanjiData;
    } else {
        return window.kanjiData.filter(k => k.level === selectedLevel);
    }
}

// 画面切り替え関数
function showScreen(screenId) {
    const screens = ['homeScreen', 'quizScreen', 'resultScreen'];
    screens.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

// ホーム画面に戻る
function goHome() {
    showScreen('homeScreen');
    currentMode = '';
    currentQuestions = [];
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = [];
    skippedAnswers = [];
    isReviewMode = false;
    
    // 復習ボタンの表示/非表示を更新
    updateReviewButton();
}

// モード開始
function startMode(mode) {
    const validModes = ['reading', 'writing', 'strokes', 'radical', 'okurigana', 'antonym', 'homophone', 'compound'];
    if (!validModes.includes(mode)) {
        alert('このもんだいはじゅんびちゅうです！');
        return;
    }
    
    currentMode = mode;
    isReviewMode = false;
    initializeQuiz();
}

// 復習モード開始（間違えた問題のみ）
function startReview() {
    const savedWrongAnswers = getWrongAnswersFromStorage();
    if (savedWrongAnswers.length === 0) {
        alert('ふくしゅうするもんだいがありません！');
        return;
    }
    
    currentMode = 'reading';
    isReviewMode = true;
    currentQuestions = shuffleArray([...savedWrongAnswers]);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = [];
    skippedAnswers = [];
    
    showScreen('quizScreen');
    displayQuestion();
}

// 結果画面から復習モード開始
function startReviewMode() {
    const reviewKanji = [...wrongAnswers, ...skippedAnswers];
    if (reviewKanji.length === 0) {
        alert('ふくしゅうするもんだいがありません！');
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

// もう一度
function restartQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = [];
    skippedAnswers = [];
    currentQuestions = shuffleArray([...currentQuestions]);
    
    showScreen('quizScreen');
    displayQuestion();
}

// クイズ初期化
function initializeQuiz() {
    const filteredKanji = getFilteredKanji();
    currentQuestions = shuffleArray([...filteredKanji]);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = [];
    skippedAnswers = [];
    
    showScreen('quizScreen');
    displayQuestion();
}

// 問題表示
function displayQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    
    // 進捗更新
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = currentQuestions.length;
    
    const progress = ((currentQuestionIndex) / currentQuestions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    // 漢字表示
    document.getElementById('kanjiDisplay').textContent = question.kanji;
    
    // モードに応じた問題プロンプト
    if (currentMode === 'reading') {
        document.getElementById('questionPrompt').textContent = 'このかんじのよみかたは？';
        displayReadingChoices(question);
    } else if (currentMode === 'strokes') {
        document.getElementById('questionPrompt').textContent = 'このかんじのかくすうは？';
        displayStrokesChoices(question);
    } else if (currentMode === 'radical') {
        document.getElementById('questionPrompt').textContent = 'このかんじのぶしゅは？';
        displayRadicalChoices(question);
    } else if (currentMode === 'writing') {
        document.getElementById('questionPrompt').textContent = 'このよみかたのかんじは？';
        displayWritingChoices(question);
    } else if (currentMode === 'okurigana') {
        document.getElementById('questionPrompt').textContent = 'ただしいおくりがなは？';
        displayOkuriganaChoices(question);
    } else if (currentMode === 'antonym') {
        document.getElementById('questionPrompt').textContent = 'はんたいのいみのかんじは？';
        displayAntonymChoices(question);
    } else if (currentMode === 'homophone') {
        document.getElementById('questionPrompt').textContent = 'おなじよみかたのかんじは？';
        displayHomophoneChoices(question);
    } else if (currentMode === 'compound') {
        document.getElementById('questionPrompt').textContent = 'このかんじをつかう3もじじゅくごは？';
        displayCompoundChoices(question);
    }
    
    // 次へボタンを隠す
    document.getElementById('nextButton').classList.add('hidden');
}

// 読み問題の選択肢を表示
function displayReadingChoices(question) {
    const container = document.getElementById('choicesContainer');
    container.innerHTML = '';
    
    // 正解の読み方を取得（音読みと訓読みを結合）
    const correctReadings = [];
    if (question.onReading) correctReadings.push(question.onReading);
    if (question.kunReading) {
        const kunReadings = question.kunReading.split('、');
        correctReadings.push(...kunReadings);
    }
    
    // 正解をランダムに1つ選ぶ
    const correctAnswer = correctReadings[Math.floor(Math.random() * correctReadings.length)];
    
    // ダミー選択肢を生成
    const otherKanji = window.kanjiData.filter(k => k.kanji !== question.kanji);
    const dummyChoices = [];
    
    while (dummyChoices.length < 3 && otherKanji.length > 0) {
        const randomKanji = otherKanji[Math.floor(Math.random() * otherKanji.length)];
        const dummyReadings = [];
        
        if (randomKanji.onReading) dummyReadings.push(randomKanji.onReading);
        if (randomKanji.kunReading) {
            const kunReadings = randomKanji.kunReading.split('、');
            dummyReadings.push(...kunReadings);
        }
        
        const dummyReading = dummyReadings[Math.floor(Math.random() * dummyReadings.length)];
        
        if (!dummyChoices.includes(dummyReading) && dummyReading !== correctAnswer) {
            dummyChoices.push(dummyReading);
        }
        
        // 無限ループ防止
        otherKanji.splice(otherKanji.indexOf(randomKanji), 1);
    }
    
    // 選択肢をシャッフル
    const choices = shuffleArray([correctAnswer, ...dummyChoices]);
    
    // 選択肢ボタンを生成
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl py-6 text-3xl font-bold shadow-lg transition transform hover:scale-105';
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice, correctAnswer, button);
        container.appendChild(button);
    });
}

// 画数問題の選択肢を表示
function displayStrokesChoices(question) {
    const container = document.getElementById('choicesContainer');
    container.innerHTML = '';
    
    // 正解の画数
    const correctAnswer = question.strokes;
    
    // ダミー選択肢を生成（正解±1〜3の範囲）
    const dummyChoices = [];
    const possibleChoices = [];
    
    // 正解の周辺の数字を候補に追加
    for (let i = -3; i <= 3; i++) {
        if (i !== 0) {
            const num = correctAnswer + i;
            if (num > 0 && num <= 30) { // 1〜30画の範囲
                possibleChoices.push(num);
            }
        }
    }
    
    // ランダムに3つ選ぶ
    const shuffledChoices = shuffleArray(possibleChoices);
    for (let i = 0; i < 3 && i < shuffledChoices.length; i++) {
        dummyChoices.push(shuffledChoices[i]);
    }
    
    // 不足分は他の漢字の画数から取得
    if (dummyChoices.length < 3) {
        const otherStrokes = window.kanjiData
            .filter(k => k.kanji !== question.kanji && k.strokes !== correctAnswer)
            .map(k => k.strokes);
        const uniqueStrokes = [...new Set(otherStrokes)];
        const shuffledStrokes = shuffleArray(uniqueStrokes);
        
        for (let i = 0; dummyChoices.length < 3 && i < shuffledStrokes.length; i++) {
            if (!dummyChoices.includes(shuffledStrokes[i])) {
                dummyChoices.push(shuffledStrokes[i]);
            }
        }
    }
    
    // 選択肢をシャッフル
    const choices = shuffleArray([correctAnswer, ...dummyChoices]);
    
    // 選択肢ボタンを生成
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-2xl py-6 text-3xl font-bold shadow-lg transition transform hover:scale-105';
        button.textContent = choice + 'かく';
        button.onclick = () => checkAnswer(choice, correctAnswer, button);
        container.appendChild(button);
    });
}

// 部首問題の選択肢を表示
function displayRadicalChoices(question) {
    const container = document.getElementById('choicesContainer');
    container.innerHTML = '';
    
    // 正解の部首
    const correctAnswer = question.radical;
    
    // ダミー選択肢を生成（他の漢字の部首から）
    const otherRadicals = window.kanjiData
        .filter(k => k.kanji !== question.kanji && k.radical !== correctAnswer)
        .map(k => k.radical);
    
    // 重複を除去
    const uniqueRadicals = [...new Set(otherRadicals)];
    const shuffledRadicals = shuffleArray(uniqueRadicals);
    
    // 3つのダミー選択肢を選ぶ
    const dummyChoices = shuffledRadicals.slice(0, 3);
    
    // 選択肢をシャッフル
    const choices = shuffleArray([correctAnswer, ...dummyChoices]);
    
    // 選択肢ボタンを生成
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-2xl py-6 text-3xl font-bold shadow-lg transition transform hover:scale-105';
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice, correctAnswer, button);
        container.appendChild(button);
    });
}

// 書き取り問題の選択肢を表示（読み→漢字）
function displayWritingChoices(question) {
    const container = document.getElementById('choicesContainer');
    container.innerHTML = '';
    
    // 正解の漢字
    const correctAnswer = question.kanji;
    
    // 読み方を表示
    const readings = [];
    if (question.onReading) readings.push(question.onReading);
    if (question.kunReading) {
        const kunReadings = question.kunReading.split('、');
        readings.push(...kunReadings);
    }
    const displayReading = readings[Math.floor(Math.random() * readings.length)];
    document.getElementById('kanjiDisplay').textContent = displayReading;
    
    // ダミー選択肢を生成（他の漢字から）
    const otherKanji = window.kanjiData
        .filter(k => k.kanji !== question.kanji)
        .map(k => k.kanji);
    
    const shuffledKanji = shuffleArray(otherKanji);
    const dummyChoices = shuffledKanji.slice(0, 3);
    
    // 選択肢をシャッフル
    const choices = shuffleArray([correctAnswer, ...dummyChoices]);
    
    // 選択肢ボタンを生成
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl py-6 text-6xl font-bold shadow-lg transition transform hover:scale-105';
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice, correctAnswer, button);
        container.appendChild(button);
    });
}

// 送り仮名問題の選択肢を表示
function displayOkuriganaChoices(question) {
    const container = document.getElementById('choicesContainer');
    container.innerHTML = '';
    
    // 送り仮名がない場合はスキップ
    if (!question.okurigana || question.okurigana.length === 0) {
        container.innerHTML = '<div class="text-2xl text-gray-600 text-center py-8">このかんじにはおくりがながありません</div>';
        setTimeout(() => skipQuestion(), 2000);
        return;
    }
    
    // 正解の送り仮名
    const correctAnswer = question.okurigana[0];
    
    // ダミー選択肢を生成
    const otherOkurigana = window.kanjiData
        .filter(k => k.kanji !== question.kanji && k.okurigana && k.okurigana.length > 0)
        .flatMap(k => k.okurigana);
    
    const uniqueOkurigana = [...new Set(otherOkurigana)];
    const shuffledOkurigana = shuffleArray(uniqueOkurigana);
    const dummyChoices = shuffledOkurigana.slice(0, 3);
    
    // 選択肢をシャッフル
    const choices = shuffleArray([correctAnswer, ...dummyChoices]);
    
    // 選択肢ボタンを生成
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white rounded-2xl py-6 text-3xl font-bold shadow-lg transition transform hover:scale-105';
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice, correctAnswer, button);
        container.appendChild(button);
    });
}

// 対義語問題の選択肢を表示
function displayAntonymChoices(question) {
    const container = document.getElementById('choicesContainer');
    container.innerHTML = '';
    
    // 対義語がない場合はスキップ
    if (!question.antonyms || question.antonyms.length === 0) {
        container.innerHTML = '<div class="text-2xl text-gray-600 text-center py-8">このかんじにははんたいごがありません</div>';
        setTimeout(() => skipQuestion(), 2000);
        return;
    }
    
    // 正解の対義語
    const correctAnswer = question.antonyms[0];
    
    // ダミー選択肢を生成
    const otherKanji = window.kanjiData
        .filter(k => k.kanji !== question.kanji && k.kanji !== correctAnswer)
        .map(k => k.kanji);
    
    const shuffledKanji = shuffleArray(otherKanji);
    const dummyChoices = shuffledKanji.slice(0, 3);
    
    // 選択肢をシャッフル
    const choices = shuffleArray([correctAnswer, ...dummyChoices]);
    
    // 選択肢ボタンを生成
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl py-6 text-6xl font-bold shadow-lg transition transform hover:scale-105';
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice, correctAnswer, button);
        container.appendChild(button);
    });
}

// 同音異字問題の選択肢を表示
function displayHomophoneChoices(question) {
    const container = document.getElementById('choicesContainer');
    container.innerHTML = '';
    
    // 同音異字がない場合はスキップ
    if (!question.homophones || question.homophones.length === 0) {
        container.innerHTML = '<div class="text-2xl text-gray-600 text-center py-8">このかんじにはどうおんいじがありません</div>';
        setTimeout(() => skipQuestion(), 2000);
        return;
    }
    
    // 正解の同音異字
    const correctAnswer = question.homophones[0];
    
    // ダミー選択肢を生成
    const otherKanji = window.kanjiData
        .filter(k => k.kanji !== question.kanji && k.kanji !== correctAnswer)
        .map(k => k.kanji);
    
    const shuffledKanji = shuffleArray(otherKanji);
    const dummyChoices = shuffledKanji.slice(0, 3);
    
    // 選択肢をシャッフル
    const choices = shuffleArray([correctAnswer, ...dummyChoices]);
    
    // 選択肢ボタンを生成
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-2xl py-6 text-6xl font-bold shadow-lg transition transform hover:scale-105';
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice, correctAnswer, button);
        container.appendChild(button);
    });
}

// 三字熟語問題の選択肢を表示
function displayCompoundChoices(question) {
    const container = document.getElementById('choicesContainer');
    container.innerHTML = '';
    
    // 三字熟語がない場合はスキップ
    if (!question.compounds || question.compounds.length === 0) {
        container.innerHTML = '<div class="text-2xl text-gray-600 text-center py-8">このかんじには3もじじゅくごがありません</div>';
        setTimeout(() => skipQuestion(), 2000);
        return;
    }
    
    // 正解の三字熟語
    const correctAnswer = question.compounds[Math.floor(Math.random() * question.compounds.length)];
    
    // ダミー選択肢を生成
    const otherCompounds = window.kanjiData
        .filter(k => k.kanji !== question.kanji && k.compounds && k.compounds.length > 0)
        .flatMap(k => k.compounds)
        .filter(c => c !== correctAnswer);
    
    const uniqueCompounds = [...new Set(otherCompounds)];
    const shuffledCompounds = shuffleArray(uniqueCompounds);
    const dummyChoices = shuffledCompounds.slice(0, 3);
    
    // 選択肢をシャッフル
    const choices = shuffleArray([correctAnswer, ...dummyChoices]);
    
    // 選択肢ボタンを生成
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white rounded-2xl py-6 text-3xl font-bold shadow-lg transition transform hover:scale-105';
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice, correctAnswer, button);
        container.appendChild(button);
    });
}

// 答え合わせ
function checkAnswer(selected, correct, button) {
    const question = currentQuestions[currentQuestionIndex];
    const allButtons = document.querySelectorAll('#choicesContainer button');
    
    // すべてのボタンを無効化
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('hover:scale-105', 'hover:from-blue-500', 'hover:to-blue-600', 
            'hover:from-yellow-500', 'hover:to-yellow-600', 'hover:from-green-500', 'hover:to-green-600',
            'hover:from-purple-500', 'hover:to-purple-600', 'hover:from-red-500', 'hover:to-red-600',
            'hover:from-indigo-500', 'hover:to-indigo-600', 'hover:from-teal-500', 'hover:to-teal-600');
    });
    
    // 数値として比較（画数問題対応）
    const isCorrect = String(selected) === String(correct);
    
    if (isCorrect) {
        // 正解
        button.className = 'bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl py-6 text-3xl font-bold shadow-lg';
        
        // 表示内容を調整
        if (currentMode === 'strokes') {
            button.innerHTML = '✅ ' + selected + 'かく';
        } else {
            button.innerHTML = '✅ ' + selected;
        }
        
        correctAnswers++;
        showFeedback('やったね！せいかい！', 'success');
    } else {
        // 不正解
        button.className = 'bg-gradient-to-r from-red-400 to-red-500 text-white rounded-2xl py-6 text-3xl font-bold shadow-lg';
        
        if (currentMode === 'strokes') {
            button.innerHTML = '❌ ' + selected + 'かく';
        } else {
            button.innerHTML = '❌ ' + selected;
        }
        
        wrongAnswers.push(question);
        
        // 正解を表示
        allButtons.forEach(btn => {
            const btnText = btn.textContent;
            let btnValue = btnText;
            
            // 画数モードの場合、「かく」を除去して比較
            if (currentMode === 'strokes') {
                btnValue = btnText.replace('かく', '');
            }
            
            if (String(btnValue) === String(correct)) {
                btn.className = 'bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl py-6 text-3xl font-bold shadow-lg';
                
                if (currentMode === 'strokes') {
                    btn.innerHTML = '✅ ' + correct + 'かく （せいかい）';
                } else {
                    btn.innerHTML = '✅ ' + correct + ' （せいかい）';
                }
            }
        });
        
        let correctDisplay = correct;
        if (currentMode === 'strokes') {
            correctDisplay = correct + 'かく';
        }
        
        showFeedback('ざんねん！せいかいは「' + correctDisplay + '」だよ', 'error');
    }
    
    // 次へボタンを表示
    document.getElementById('nextButton').classList.remove('hidden');
}

// フィードバック表示
function showFeedback(message, type) {
    // 既存のフィードバックを削除
    const existingFeedback = document.querySelector('.feedback-message');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message text-center py-4 px-6 rounded-2xl text-2xl font-bold mt-4 animate-bounce';
    
    if (type === 'success') {
        feedback.className += ' bg-green-100 text-green-700';
    } else {
        feedback.className += ' bg-red-100 text-red-700';
    }
    
    feedback.textContent = message;
    
    const quizCard = document.querySelector('#quizScreen .bg-white');
    quizCard.appendChild(feedback);
}

// 次の問題へ
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= currentQuestions.length) {
        // クイズ終了
        showResults();
    } else {
        displayQuestion();
    }
}

// スキップ
function skipQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    skippedAnswers.push(question);
    nextQuestion();
}

// 結果表示
function showResults() {
    const totalQuestions = currentQuestions.length;
    const correctCount = correctAnswers;
    const wrongCount = wrongAnswers.length;
    const skipCount = skippedAnswers.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    
    // 結果に応じた絵文字
    let emoji = '🎉';
    if (scorePercentage >= 90) {
        emoji = '🎉';
    } else if (scorePercentage >= 70) {
        emoji = '😊';
    } else if (scorePercentage >= 50) {
        emoji = '🙂';
    } else {
        emoji = '💪';
    }
    
    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('scoreDisplay').textContent = scorePercentage + '%';
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('wrongCount').textContent = wrongCount;
    document.getElementById('skipCount').textContent = skipCount;
    
    // 間違えた漢字リスト
    const wrongKanjiList = document.getElementById('wrongKanjiList');
    const wrongKanjiContent = document.getElementById('wrongKanjiContent');
    
    if (wrongCount > 0 || skipCount > 0) {
        wrongKanjiList.classList.remove('hidden');
        const allWrong = [...wrongAnswers, ...skippedAnswers];
        wrongKanjiContent.textContent = allWrong.map(k => k.kanji).join('　');
        
        // 復習ボタンを表示
        document.getElementById('reviewModeButton').classList.remove('hidden');
        
        // ローカルストレージに保存
        saveWrongAnswersToStorage(allWrong);
    } else {
        wrongKanjiList.classList.add('hidden');
        document.getElementById('reviewModeButton').classList.add('hidden');
    }
    
    showScreen('resultScreen');
    updateReviewButton();
}

// 配列をシャッフル
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// ローカルストレージに間違えた問題を保存
function saveWrongAnswersToStorage(wrongKanji) {
    try {
        const existingWrong = getWrongAnswersFromStorage();
        
        // 既存の間違いと新しい間違いをマージ（重複を除く）
        const kanjiSet = new Set([...existingWrong.map(k => k.kanji), ...wrongKanji.map(k => k.kanji)]);
        const mergedWrong = Array.from(kanjiSet).map(kanji => {
            return window.kanjiData.find(k => k.kanji === kanji);
        }).filter(k => k !== undefined);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedWrong));
    } catch (e) {
        console.error('保存エラー:', e);
    }
}

// ローカルストレージから間違えた問題を取得
function getWrongAnswersFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('読み込みエラー:', e);
        return [];
    }
}

// 復習ボタンの表示/非表示を更新
function updateReviewButton() {
    const reviewButton = document.getElementById('reviewButton');
    const wrongKanji = getWrongAnswersFromStorage();
    
    if (wrongKanji.length > 0) {
        reviewButton.classList.remove('hidden');
        reviewButton.innerHTML = `🔄 ふくしゅうモード (${wrongKanji.length}もん)`;
    } else {
        reviewButton.classList.add('hidden');
    }
}

// ページ読み込み時に復習ボタンを更新
document.addEventListener('DOMContentLoaded', () => {
    updateReviewButton();
    setLevel('all'); // デフォルトで「すべて」を選択
    
    // グローバル関数を確実に公開
    window.startMode = startMode;
    window.goHome = goHome;
    window.startReview = startReview;
    window.startReviewMode = startReviewMode;
    window.restartQuiz = restartQuiz;
    window.checkAnswer = checkAnswer;
    window.nextQuestion = nextQuestion;
    window.skipQuestion = skipQuestion;
    window.setLevel = setLevel;
});
