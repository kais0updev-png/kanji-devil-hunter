# 🔧 カード表示エラー修正 - 詳細デバッグ版 (2026-02-08)

## 🚨 発生したエラー

```
Cannot set properties of null (setting 'innerHTML')
at HTMLAnchorElement.onclick
at startCardsSession (chainsaw-app.js:1280:59)
```

---

## 🔍 根本原因の特定

### 原因1: `loadingMessage` 要素が存在しない ❌
```javascript
// Line 1280
document.getElementById('loadingMessage').textContent = 'カードデータ読み込み中...';
```

**問題**: HTML に `id="loadingMessage"` の要素が存在しない

**修正**: 既存の `.csm-loading-title` を使用
```javascript
const loadingTitle = document.querySelector('.csm-loading-title');
if (loadingTitle) {
  loadingTitle.textContent = 'カードデータ読み込み中...';
}
```

---

### 原因2: `display: none` 要素の子要素が取得できない可能性 ⚠️

```css
.hidden {
  display: none !important;
}
```

**問題**: `cardsScreen` が `hidden` クラスで非表示の状態から表示に切り替わる際、
子要素（`cardFront`, `cardBack` など）の取得タイミングが早すぎる

**修正**:
1. 遅延時間を **100ms → 500ms** に延長
2. `showCardsScreen()` で強制的に再描画をトリガー (`offsetHeight` アクセス)
3. 詳細なデバッグログを追加

---

## ✅ 修正内容

### 修正1: `loadingMessage` エラーの解消

**Before**:
```javascript
document.getElementById('loadingMessage').textContent = 'カードデータ読み込み中...';
// ❌ loadingMessage 要素が存在しない → エラー
```

**After**:
```javascript
// Update loading message if element exists
const loadingTitle = document.querySelector('.csm-loading-title');
if (loadingTitle) {
  loadingTitle.textContent = 'カードデータ読み込み中...';
}
// ✅ 存在チェック付きで安全にアクセス
```

---

### 修正2: タイミング調整（100ms → 500ms）

**Before**:
```javascript
showCardsScreen();
setTimeout(() => {
  resetCardState();
  displayCurrentCard();
}, 100); // 短すぎる可能性
```

**After**:
```javascript
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
}, 500); // ✅ 500msに延長
```

---

### 修正3: `showCardsScreen()` の強化

**Before**:
```javascript
function showCardsScreen() {
  document.getElementById('homeScreen').classList.add('hidden');
  document.getElementById('loadingScreen').classList.add('hidden');
  document.getElementById('errorScreen').classList.add('hidden');
  document.getElementById('cardsScreen').classList.remove('hidden');
}
```

**After**:
```javascript
function showCardsScreen() {
  console.log('🎴 カード画面を表示');
  
  try {
    // 全ての画面を非表示（安全なオプショナルチェーン）
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
    cardsScreen.offsetHeight; // ✅ レイアウトを再計算させる
    
    console.log('✅ カード画面表示完了');
    console.log('🔍 cardsScreen.classList:', cardsScreen.classList.toString());
    
  } catch (error) {
    console.error('❌ showCardsScreen エラー:', error);
  }
}
```

**改善点**:
- ✅ 要素の存在チェック
- ✅ オプショナルチェーン (`?.`) で安全にアクセス
- ✅ `offsetHeight` で強制的に再描画
- ✅ try-catch でエラーハンドリング
- ✅ 詳細なログ出力

---

### 修正4: `displayCurrentCard()` の詳細デバッグ

**追加したログ**:
```javascript
// 親要素の確認
const cardsScreen = document.getElementById('cardsScreen');
console.log('🔍 親要素 cardsScreen:', cardsScreen);
console.log('🔍 cardsScreen.style.display:', cardsScreen?.style.display);
console.log('🔍 cardsScreen.classList:', cardsScreen?.classList.toString());

// 要素の存在チェック
console.log('🔍 要素を取得中...');
const elements = { ... };

// 詳細なログ
console.log('🔍 取得した要素:', elements);

// エラー時に HTML 構造を出力
if (cardsScreen) {
  console.error('🔍 cardsScreen.innerHTML の最初の500文字:', 
    cardsScreen.innerHTML.substring(0, 500));
}
```

**目的**: 
- 要素が取得できない原因を特定
- HTML構造が正しいか確認
- `hidden` クラスの影響を確認

---

## 🧪 テスト手順

### ステップ1: 完全なキャッシュクリア

**Chrome/Edge**:
1. `Ctrl+Shift+Delete`
2. 「キャッシュされた画像とファイル」にチェック
3. 「データを削除」

または **シークレットモード** で開く

### ステップ2: ページをリロード
`Ctrl+Shift+R` (スーパーリロード)

### ステップ3: コンソールを開く
`F12` → Console タブ

### ステップ4: CARDボタンをクリック

### ステップ5: コンソールログを確認

---

## 📊 期待されるログ出力

### 成功した場合

```javascript
🎴 カードセッション開始処理
📊 モード: all
🌐 Google Spreadsheetからカードデータ取得中...
✅ カードデータ確認: 200枚
📇 最初のカード: {id: "1", word: "学校に□く", ...}
📇 最後のカード: {id: "200", ...}
🎴 カードセッション開始: 200枚
🎴 カード画面を表示
✅ カード画面表示完了
🔍 cardsScreen.classList: csm-container
⏰ 遅延実行開始（500ms後）
🔍 cardsScreen: <div id="cardsScreen" class="csm-container">...</div>
🔍 cardFront: <div id="cardFront" class="card-content-vertical">...</div>
🔍 cardsScreen.classList: csm-container
🔄 カード状態をリセット
✅ カード状態リセット完了
📇 カード表示開始
📇 カード表示: 1/200 - 学校に□く
🔍 親要素 cardsScreen: <div id="cardsScreen"...>
🔍 cardsScreen.style.display: (空文字列)
🔍 cardsScreen.classList: csm-container
🔍 要素を取得中...
🔍 取得した要素: {cardFront: div#cardFront, cardBack: div#cardBack, ...}
✅ カード表示完了
```

### 失敗した場合（デバッグ情報が出力される）

```javascript
📇 カード表示開始
🔍 親要素 cardsScreen: <div id="cardsScreen" class="csm-container hidden">
🔍 cardsScreen.style.display: none
🔍 cardsScreen.classList: csm-container hidden
🔍 要素を取得中...
🔍 取得した要素: {cardFront: null, cardBack: null, ...}
❌ 要素が見つかりません: cardFront
🔍 document.getElementById('cardFront'): null
🔍 cardsScreen.innerHTML の最初の500文字: <div class="cards-container">...
[Alert表示] エラー: HTML要素が見つかりません (cardFront)
```

---

## 🔧 追加のトラブルシューティング

### もし500msでも失敗する場合

**1000ms (1秒) に延長**:

`js/chainsaw-app.js` の該当行を修正:
```javascript
}, 1000); // 500 → 1000 に変更
```

### `display: none` 問題を根本的に解決

`css/chainsaw-design.css` の `.hidden` クラスを変更:

**Before**:
```css
.hidden {
  display: none !important;
}
```

**After** (代替案):
```css
.hidden {
  visibility: hidden !important;
  opacity: 0 !important;
  position: absolute !important;
  pointer-events: none !important;
}
```

**メリット**:
- ✅ 要素がDOMに残る（子要素が取得可能）
- ✅ 視覚的には完全に非表示

**デメリット**:
- ⚠️ レイアウトに影響を与える可能性（`position: absolute` で回避）

---

## 📋 チェックリスト

修正後、以下を確認してください:

- [x] `loadingMessage` エラーを修正（`.csm-loading-title` を使用）
- [x] タイミング調整（100ms → 500ms）
- [x] `showCardsScreen()` に再描画トリガー追加
- [x] `displayCurrentCard()` に詳細ログ追加
- [ ] ブラウザでテスト実施
- [ ] コンソールログを確認
- [ ] カードが正常に表示される

---

## 🎯 まとめ

### 修正した問題
1. **loadingMessage 要素不在** → `.csm-loading-title` を使用
2. **タイミング不足** → 100ms → 500ms に延長
3. **再描画されない** → `offsetHeight` で強制トリガー
4. **デバッグ不足** → 詳細ログを追加

### 次のステップ
1. **Ctrl+Shift+R** でリロード
2. **F12** でコンソールを開く
3. **CARD** ボタンをクリック
4. **ログを確認**して原因を特定

**もしまだエラーが出る場合は、コンソールの全ログをコピーしてください。**

---

**Status**: ✅ 修正完了（デバッグ強化版）  
**Date**: 2026-02-08  
**Test**: ブラウザで確認してください
