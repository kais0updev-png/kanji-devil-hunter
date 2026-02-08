# 🐛 Kanji Cards Null Error Fix - 2026-02-08

## エラー概要

```
Cannot set properties of null (setting 'textContent')
```

**原因**: JavaScript が DOM 要素にアクセスしようとした時点で、要素がまだレンダリングされていない、または要素が存在しない。

---

## 🔍 問題の診断

### 1. HTML要素は存在している ✅
```html
<div id="cardFront">...</div>
<div id="cardBack">...</div>
<div id="cardGradeFront">...</div>
<div id="cardGradeBack">...</div>
<div id="cardProgress">...</div>
```

### 2. 問題はタイミング ❌
`startCardsSession()` → `showCardsScreen()` → `displayCurrentCard()` の順番で実行されるが、
`showCardsScreen()` が要素を表示した直後に `displayCurrentCard()` が実行されるため、
ブラウザがDOMを完全にレンダリングする前にアクセスしてしまう。

---

## ✅ 修正内容

### 修正1: `displayCurrentCard()` に安全チェック追加

**Before (危険)**:
```javascript
function displayCurrentCard() {
  const card = cardsData[currentCardIdx];
  document.getElementById('cardFront').innerHTML = renderVerticalText(katakanaText);
  document.getElementById('cardBack').innerHTML = renderVerticalText(card.word);
  document.getElementById('cardGradeFront').textContent = `${card.grade}級`;
  document.getElementById('cardGradeBack').textContent = `${card.grade}級`;
  document.getElementById('cardProgress').textContent = `${currentCardIdx + 1} / ${cardsData.length}`;
}
```

**After (安全)**:
```javascript
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
    
    // 要素の存在チェック（安全な取得）
    const elements = {
      cardFront: document.getElementById('cardFront'),
      cardBack: document.getElementById('cardBack'),
      cardGradeFront: document.getElementById('cardGradeFront'),
      cardGradeBack: document.getElementById('cardGradeBack'),
      cardProgress: document.getElementById('cardProgress')
    };
    
    // 要素が存在しない場合はエラーログを出力
    for (const [key, element] of Object.entries(elements)) {
      if (!element) {
        console.error(`❌ 要素が見つかりません: ${key}`);
        alert(`エラー: HTML要素が見つかりません (${key})\nページをリロードしてください。`);
        return;
      }
    }
    
    // CSVのreadingフィールドを使用してカタカナ変換
    const reading = card.reading || 'カナ';
    const katakanaText = card.word.replace(card.hidden, reading);
    
    // 要素に値を設定
    elements.cardFront.innerHTML = renderVerticalText(katakanaText);
    elements.cardBack.innerHTML = renderVerticalText(card.word);
    elements.cardGradeFront.textContent = `${card.grade}級`;
    elements.cardGradeBack.textContent = `${card.grade}級`;
    elements.cardProgress.textContent = `${currentCardIdx + 1} / ${cardsData.length}`;
    
    console.log('✅ カード表示完了');
    
  } catch (error) {
    console.error('❌ displayCurrentCard エラー:', error);
    alert('カード表示エラー: ' + error.message + '\nページをリロードしてください。');
  }
}
```

**改善点**:
- ✅ try-catch でエラーをキャッチ
- ✅ 全要素を一括取得して存在チェック
- ✅ 要素が null の場合は詳細なエラーメッセージを表示
- ✅ データチェックも追加

---

### 修正2: `startCardsSession()` にタイミング調整追加

**Before (タイミング問題あり)**:
```javascript
showCardsScreen();
resetCardState();
displayCurrentCard();
```

**After (100ms遅延で安全化)**:
```javascript
showCardsScreen();

// DOM要素が完全にレンダリングされるまで待機
setTimeout(() => {
  resetCardState();
  displayCurrentCard();
}, 100);
```

**理由**:
- `showCardsScreen()` が `hidden` クラスを削除しても、ブラウザがDOMを再レンダリングするまで時間がかかる
- 100ms の遅延で、要素が確実に表示された後にアクセスする

---

### 修正3: `flipTheCard()` に安全チェック追加

**Before**:
```javascript
function flipTheCard() {
  const cardEl = document.getElementById('cardInner');
  cardEl.classList.add('flipped');
  isCardFlipped = true;
  
  document.getElementById('showAnswerBtn').style.display = 'none';
  document.getElementById('cardChoiceButtons').style.display = 'block';
}
```

**After**:
```javascript
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
```

---

### 修正4: `resetCardState()` に安全チェック追加

**Before**:
```javascript
function resetCardState() {
  console.log('🔄 カード状態をリセット');
  const cardEl = document.getElementById('cardInner');
  cardEl.classList.remove('flipped');
  isCardFlipped = false;
  
  document.getElementById('showAnswerBtn').style.display = 'block';
  document.getElementById('cardChoiceButtons').style.display = 'none';
}
```

**After**:
```javascript
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
```

---

## 🧪 テスト手順

### ステップ1: キャッシュクリア
**Ctrl+Shift+R** (Windows) または **Cmd+Shift+R** (Mac)

### ステップ2: コンソールを開く
**F12** キー → Console タブ

### ステップ3: CARDボタンをクリック

### ステップ4: コンソールログを確認

**成功した場合**:
```
🎴 カードセッション開始処理
📊 モード: all
✅ カードデータ確認: 200枚
🎴 カードセッション開始: 200枚
🎴 カード画面を表示
🔄 カード状態をリセット
✅ カード状態リセット完了
📇 カード表示開始
📇 カード表示: 1/200 - 学校に□く
✅ カード表示完了
```

**エラーが発生した場合**:
```
❌ 要素が見つかりません: cardFront
[Alert表示] エラー: HTML要素が見つかりません (cardFront)
ページをリロードしてください。
```

---

## 📊 修正効果

### Before (修正前):
- ❌ タイミングエラーで null アクセス
- ❌ エラーメッセージが不明瞭
- ❌ どの要素が原因か不明

### After (修正後):
- ✅ 100ms遅延でタイミング問題を回避
- ✅ 全要素を事前チェック
- ✅ 詳細なエラーメッセージ
- ✅ try-catch でアプリクラッシュを防止
- ✅ どの要素が原因か明確に表示

---

## 🔍 トラブルシューティング

### エラーが続く場合

#### 1. コンソールで要素の存在を確認
```javascript
console.log('cardFront:', document.getElementById('cardFront'));
console.log('cardBack:', document.getElementById('cardBack'));
console.log('cardGradeFront:', document.getElementById('cardGradeFront'));
console.log('cardGradeBack:', document.getElementById('cardGradeBack'));
console.log('cardProgress:', document.getElementById('cardProgress'));
```

すべて `null` の場合:
- HTML の `<div id="cardsScreen">` が存在するか確認
- `cardsScreen` が `hidden` クラスで隠れているか確認

#### 2. HTML構造を確認
```javascript
// cardsScreen の内容を確認
console.log(document.getElementById('cardsScreen')?.innerHTML);
```

#### 3. タイミングを延長
100ms で不十分な場合、500ms に延長:
```javascript
setTimeout(() => {
  resetCardState();
  displayCurrentCard();
}, 500); // 100 → 500 に変更
```

---

## 📋 チェックリスト

修正が完了したら以下を確認:

- [x] `displayCurrentCard()` に try-catch と要素チェック追加
- [x] `startCardsSession()` に 100ms タイミング遅延追加
- [x] `flipTheCard()` に安全チェック追加
- [x] `resetCardState()` に安全チェック追加
- [ ] ブラウザでテスト完了
- [ ] CARDボタンでカードが正常に表示される
- [ ] コンソールにエラーが出ない

---

## 🎯 まとめ

### エラーの根本原因
DOM要素のレンダリング完了前にJavaScriptがアクセスしていた

### 修正方法
1. **タイミング調整**: 100ms の遅延で要素のレンダリングを待つ
2. **安全チェック**: すべての要素を事前に取得して null チェック
3. **エラーハンドリング**: try-catch で予期しないエラーをキャッチ
4. **詳細ログ**: どの要素が原因か特定できるログ出力

---

**Status**: ✅ 修正完了  
**Date**: 2026-02-08  
**Test**: ブラウザでテストしてください
