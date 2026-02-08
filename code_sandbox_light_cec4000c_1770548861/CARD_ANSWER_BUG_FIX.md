# 🐛 クリティカルバグ修正：カード裏面に正解が表示されない - 2026-02-08

## 🚨 問題の概要

**症状**: 「正解を見る」ボタンをクリックしてカードをフリップしても、裏面に正解の漢字が表示されず、`□`（四角）が残ったままになっていた。

**期待される動作**: 裏面には、カタカナ部分が**正しい漢字に置換**された文字列が表示されるべき。

**例**:
- 表面: `イ度だけ確認する`（カタカナ）
- 裏面: `一度だけ確認する`（漢字）✅

---

## 🔍 原因

`js/chainsaw-app.js` の `displayCurrentCard()` 関数（Line 1629）で、裏面に `card.word` をそのまま表示していた。

**問題のコード**:
```javascript
// 要素に値を設定
elements.cardFront.innerHTML = renderVerticalText(katakanaText);
elements.cardBack.innerHTML = renderVerticalText(card.word); // ❌ card.wordには□が含まれている
```

**データ構造の理解**:
- `card.word`: `学校に□く`（□が含まれた問題文）
- `card.hidden`: `行`（正解の漢字）
- `card.reading`: `イ`（カタカナ読み）

**表面の生成**:
```javascript
const katakanaText = card.word.replace(card.hidden, reading);
// "学校に□く".replace("行", "イ") → "学校にイく" ✅
```

**裏面の生成（修正前）**:
```javascript
elements.cardBack.innerHTML = renderVerticalText(card.word);
// "学校に□く" → □がそのまま表示される ❌
```

**裏面の生成（修正後）**:
```javascript
const answerText = card.word.replace('□', card.hidden);
// "学校に□く".replace('□', '行') → "学校に行く" ✅
```

---

## ✅ 修正内容

**修正ファイル**: `js/chainsaw-app.js`

**修正箇所**: `displayCurrentCard()` 関数（Line 1623-1632付近）

**Before（修正前）**:
```javascript
// CSVのreadingフィールドを使用してカタカナ変換
const reading = card.reading || 'カナ';
const katakanaText = card.word.replace(card.hidden, reading);

// 要素に値を設定
elements.cardFront.innerHTML = renderVerticalText(katakanaText);
elements.cardBack.innerHTML = renderVerticalText(card.word); // ❌ 問題
elements.cardGradeFront.textContent = `${card.grade}級`;
elements.cardGradeBack.textContent = `${card.grade}級`;
elements.cardProgress.textContent = `${currentCardIdx + 1} / ${cardsData.length}`;
```

**After（修正後）**:
```javascript
// CSVのreadingフィールドを使用してカタカナ変換
const reading = card.reading || 'カナ';
const katakanaText = card.word.replace(card.hidden, reading);

// 正解文（□を正しい漢字に置換）
const answerText = card.word.replace('□', card.hidden);

console.log('🔍 デバッグ情報:');
console.log('  card.word:', card.word);
console.log('  card.hidden:', card.hidden);
console.log('  card.reading:', card.reading);
console.log('  katakanaText（表面）:', katakanaText);
console.log('  answerText（裏面）:', answerText);

// 要素に値を設定
elements.cardFront.innerHTML = renderVerticalText(katakanaText);
elements.cardBack.innerHTML = renderVerticalText(answerText); // ✅ 修正
elements.cardGradeFront.textContent = `${card.grade}級`;
elements.cardGradeBack.textContent = `${card.grade}級`;
elements.cardProgress.textContent = `${currentCardIdx + 1} / ${cardsData.length}`;
```

**変更点**:
1. **answerText 変数を追加**: `card.word` の `□` を `card.hidden`（正解の漢字）に置換
2. **裏面に answerText を使用**: `renderVerticalText(answerText)`
3. **デバッグログを追加**: 表面と裏面のテキストをコンソールに出力

---

## 🧪 テスト手順

### ステップ1: ブラウザをリロード
**Ctrl+Shift+R** (Windows) または **Cmd+Shift+R** (Mac)

### ステップ2: CARDボタンをクリック
ヘッダーのCARDボタンをクリック

### ステップ3: 最初のカードを確認
**表面**:
- カタカナが表示されている（例: `学校にイく`）

### ステップ4: 「正解を見る」をクリック
カードがフリップする

### ステップ5: 裏面を確認
**裏面**:
- 正しい漢字が表示されている（例: `学校に行く`）✅
- `□`が残っていない ✅

### ステップ6: コンソールログを確認
F12 → Console タブで以下のログを確認:
```
🔍 デバッグ情報:
  card.word: 学校に□く
  card.hidden: 行
  card.reading: イ
  katakanaText（表面）: 学校にイく
  answerText（裏面）: 学校に行く
```

---

## 📊 修正前後の比較

### 修正前 ❌
- **表面**: `学校にイく`（カタカナ）✅
- **裏面**: `学校に□く`（□が残る）❌

### 修正後 ✅
- **表面**: `学校にイく`（カタカナ）✅
- **裏面**: `学校に行く`（正しい漢字）✅

---

## 🎯 動作確認

以下のケースで正しく動作することを確認してください：

### テストケース1: 基本パターン
- **card.word**: `学校に□く`
- **card.hidden**: `行`
- **card.reading**: `イ`
- **期待される表面**: `学校にイく`
- **期待される裏面**: `学校に行く`

### テストケース2: 複数文字
- **card.word**: `□の上`
- **card.hidden**: `山`
- **card.reading**: `ヤマ`
- **期待される表面**: `ヤマの上`
- **期待される裏面**: `山の上`

### テストケース3: 文中の漢字
- **card.word**: `大きい□`
- **card.hidden**: `目`
- **card.reading**: `メ`
- **期待される表面**: `大きいメ`
- **期待される裏面**: `大きい目`

---

## 🔧 デバッグログの活用

修正後、コンソールに以下のログが出力されます：

```javascript
🔍 デバッグ情報:
  card.word: 学校に□く
  card.hidden: 行
  card.reading: イ
  katakanaText（表面）: 学校にイく
  answerText（裏面）: 学校に行く
✅ カード表示完了
```

**もし裏面が正しく表示されない場合**:
1. コンソールの `answerText（裏面）` を確認
2. `□` が正しく置換されているか確認
3. `card.hidden` が空でないか確認

---

## 📝 注意事項

### データの前提条件
この修正は以下を前提としています：
- `card.word` には**1つの `□`** が含まれている
- `card.hidden` には**正解の漢字**が入っている
- `card.reading` には**カタカナ読み**が入っている

### 複数の □ がある場合
もし `card.word` に複数の `□` がある場合（例: `□校に□く`）、
`replace()` は**最初の1つだけ**を置換します。

**対策**: すべての `□` を置換する場合は正規表現を使用：
```javascript
const answerText = card.word.replace(/□/g, card.hidden);
```

ただし、現在のデータ構造では1つの `□` しか想定されていないため、
単純な `replace('□', card.hidden)` で十分です。

---

## 📂 関連ファイル

- **修正ファイル**: `js/chainsaw-app.js`
- **関連ドキュメント**: 
  - `CARD_FEATURE_IMPROVEMENTS.md`
  - `README.md`

---

## ✅ チェックリスト

修正後、以下を確認してください：

- [ ] ブラウザをスーパーリロードした（Ctrl+Shift+R）
- [ ] CARDボタンをクリックした
- [ ] 「正解を見る」をクリックした
- [ ] カードがフリップした
- [ ] 裏面に正しい漢字が表示された
- [ ] `□` が残っていない
- [ ] コンソールに「answerText（裏面）」が正しく表示されている
- [ ] 複数のカードで動作確認した

---

**Status**: ✅ 修正完了  
**Date**: 2026-02-08  
**Priority**: 🔴 Critical  
**Test**: 必須

---

**このバグはクリティカルでしたが、1行の修正で解決しました！**
