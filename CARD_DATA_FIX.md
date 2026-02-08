# 🔧 カード裏面修正（データ異常対応）- 2026-02-08

## 🐛 発見された問題

**症状**: カードをフリップしても、裏面にカタカナが表示されたまま漢字に変わらない。

**コンソールログから判明**:
```
card.word: アメが降る雨る
card.hidden: 雨
card.reading: アメ
katakanaText（表面）: アメが降る雨る
answerText（裏面）: アメが降る雨る ❌
```

**根本原因**: Google Spreadsheetの `word` 列（2列目）に、**既にカタカナが入っている**。
本来は `□が降る雨る` であるべきだが、実際には `アメが降る雨る` になっている。

---

## 🔍 データ構造の想定

### 正しいデータ形式
| id | word | hidden | reading | grade |
|----|------|--------|---------|-------|
| 1 | `□が降る雨る` | `雨` | `アメ` | 10 |

### 実際のデータ（異常）
| id | word | hidden | reading | grade |
|----|------|--------|---------|-------|
| 1 | `アメが降る雨る` | `雨` | `アメ` | 10 |

---

## ✅ 修正内容

**修正ファイル**: `js/chainsaw-app.js`

**修正箇所**: `displayCurrentCard()` 関数

### 修正後のロジック

```javascript
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
elements.cardBack.innerHTML = renderVerticalText(answerText);
```

---

## 📊 動作例

### ケース1: 正常なデータ（`□` 含む）
**入力**:
- `card.word`: `□が降る雨る`
- `card.hidden`: `雨`
- `card.reading`: `アメ`

**出力**:
- 表面: `アメが降る雨る` ✅
- 裏面: `雨が降る雨る` ✅

---

### ケース2: 異常なデータ（既にカタカナ）
**入力**:
- `card.word`: `アメが降る雨る`
- `card.hidden`: `雨`
- `card.reading`: `アメ`

**出力**:
- 表面: `アメが降る雨る` ✅（変更なし）
- 裏面: `雨が降る雨る` ✅（カタカナ → 漢字）

**コンソールログ**:
```
⚠️ データ異常: card.wordに既にカタカナが含まれています
  修正前: アメが降る雨る
  修正後: □が降る雨る
🔍 デバッグ情報:
  card.word: アメが降る雨る
  card.hidden: 雨
  card.reading: アメ
  wordWithSquare: □が降る雨る
  katakanaText（表面）: アメが降る雨る
  answerText（裏面）: 雨が降る雨る
```

---

## 🧪 テスト手順

### ステップ1: ブラウザをリロード
**Ctrl+Shift+R** (Windows) または **Cmd+Shift+R** (Mac)

### ステップ2: CARDボタンをクリック

### ステップ3: コンソールログを確認
F12 → Console タブで以下を確認:

**正常なデータの場合**:
```
🔍 デバッグ情報:
  card.word: □が降る雨る
  answerText（裏面）: 雨が降る雨る
```

**異常なデータの場合**:
```
⚠️ データ異常: card.wordに既にカタカナが含まれています
  修正前: アメが降る雨る
  修正後: □が降る雨る
🔍 デバッグ情報:
  answerText（裏面）: 雨が降る雨る
```

### ステップ4: カードをフリップ
「正解を見る」をクリック

### ステップ5: 裏面を確認
- [ ] 裏面に**漢字**が表示される（例: `雨が降る雨る`）
- [ ] カタカナが残っていない

---

## 🔧 根本的な解決方法（推奨）

### Google Spreadsheetのデータを修正

**現在の `word` 列**:
```
アメが降る雨る
```

**修正後の `word` 列**:
```
□が降る雨る
```

**修正手順**:
1. Google Spreadsheet「単語カード」シートを開く
2. `word` 列（B列）を確認
3. カタカナ部分を `□` に置換
4. 保存

**一括置換方法**:
1. B列を選択
2. `Ctrl+H`（検索と置換）
3. 検索: 各カードの `reading` 値（例: `アメ`）
4. 置換: `□`
5. すべて置換

---

## 📝 注意事項

### 現在の対応
このコード修正により、**データが異常でも動作する**ようになりました。

### 長期的な推奨
Google Spreadsheetのデータを正しい形式（`□` 含む）に修正することを推奨します。

**理由**:
- データの一貫性が保たれる
- コードがシンプルになる
- 将来の拡張が容易

---

## 📂 関連ファイル

- **修正ファイル**: `js/chainsaw-app.js`
- **関連ドキュメント**: 
  - `CARD_ANSWER_BUG_FIX.md`
  - `CARD_FEATURE_IMPROVEMENTS.md`

---

## ✅ チェックリスト

- [ ] ブラウザをスーパーリロードした
- [ ] CARDボタンをクリックした
- [ ] コンソールログを確認した
- [ ] データ異常の警告が表示されたか確認した
- [ ] 「正解を見る」をクリックした
- [ ] 裏面に漢字が正しく表示された
- [ ] カタカナが残っていない
- [ ] 複数のカードで動作確認した

---

**Status**: ✅ 修正完了（データ異常対応版）  
**Date**: 2026-02-08  
**Priority**: 🔴 Critical  
**推奨**: Google Spreadsheetのデータを修正

---

**この修正により、データが正しくなくても動作するようになりました！**
