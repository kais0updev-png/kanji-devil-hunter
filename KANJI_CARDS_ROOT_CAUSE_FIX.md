# 🔧 ローディング画面スタック問題の根本原因修正完了

**実装日**: 2026-02-07  
**問題**: CARDボタンをクリックしてもカードデータが読み込まれない  
**原因**: CARDボタンが `startCardsSession()` ではなく `showCardsScreen()` を呼んでいた

---

## ✅ 根本原因の発見

### コンソールログの分析

**ユーザーのログ**:
```
✅ 642字の漢字データが読み込まれました
📊 10級: 80字
... (問題データのログ)
[SandboxInspect] Snapshot added: initial (1/1)
[SandboxInspect] Library loaded and ready
[SandboxInspect] diff-doc loaded successfully
[SandboxInspect] diff-doc preloaded
```

**重要な発見**:
- ❌ 「🎴 カードセッション開始処理」がない
- ❌ 「🌐 Google Spreadsheetからカードデータ取得中...」がない
- ❌ カードデータ関連のログが一切ない

**結論**: `startCardsSession()` 関数が**全く呼ばれていない**

---

## 🐛 問題の原因

### HTMLのボタン設定

**問題のコード** (`index.html` 行52):
```html
<a href="#" class="csm-nav-link" onclick="showCardsScreen(); return false;">CARD</a>
```

**問題点**:
- `showCardsScreen()` は画面を切り替えるだけ
- カードデータをロードしていない
- ローディング画面が表示されたまま

**正しい動作フロー**:
```
CARDボタンクリック
  ↓
startCardsSession('all')  ← これが必要
  ↓
カードデータ取得
  ↓
showCardsScreen()
  ↓
displayCurrentCard()
```

---

## 🔧 修正内容

### HTMLの修正

**修正前**:
```html
<a href="#" class="csm-nav-link" onclick="showCardsScreen(); return false;">CARD</a>
```

**修正後**:
```html
<a href="#" class="csm-nav-link" onclick="startCardsSession('all'); return false;">CARD</a>
```

**変更点**:
- `showCardsScreen()` → `startCardsSession('all')`
- これでカードデータが正しくロードされる

---

## 📊 変更ファイル

| ファイル | 変更内容 | 変更量 |
|---------|---------|--------|
| `index.html` | CARDボタンのイベント修正 | 1行 |
| `KANJI_CARDS_ROOT_CAUSE_FIX.md` | 完了報告 | 新規作成 |

**合計変更量**: **1行**（重要な1行）

---

## 🎯 動作フロー

### 修正前（間違い）

```
ユーザー: CARDボタンクリック
  ↓
showCardsScreen() 実行
  ↓
ローディング画面を非表示にしようとする
  ↓
❌ でもカードデータがない（cardsData = []）
  ↓
❌ displayCurrentCard() でエラー
  ↓
❌ ローディング画面が残る
```

### 修正後（正しい）

```
ユーザー: CARDボタンクリック
  ↓
startCardsSession('all') 実行
  ↓
console.log('🎴 カードセッション開始処理')
  ↓
Google Spreadsheetからデータ取得
  ↓
cardsData = [データ]
  ↓
showCardsScreen()
  ↓
ローディング画面を非表示
  ↓
displayCurrentCard()
  ↓
✅ カード表示成功
```

---

## 🚀 確認手順（ユーザー向け）

### ステップ1: ページをリロード

**キーボードショートカット**:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

または、F12 → Console:
```javascript
location.reload(true);
```

### ステップ2: CARDボタンをクリック

### ステップ3: コンソールログを確認

**期待されるログ**:
```
🎴 カードセッション開始処理
📦 キャッシュからカードデータ読み込み: N枚
または
🌐 Google Spreadsheetからカードデータ取得中...
📄 CSV取得完了: XXXX文字
📋 CSVからN行を抽出
📇 カード1: {id: "...", word: "...", ...}
📇 カード2: {id: "...", word: "...", ...}
📇 カード3: {id: "...", word: "...", ...}
✅ カードデータ読み込み完了: N枚
✅ カードデータ確認: N枚
📇 最初のカード: {id: "...", word: "...", ...}
🎴 カードセッション開始: N枚
🎴 カード画面を表示
🔄 カード状態をリセット
📇 カード表示: 1/N - XXX
```

### ステップ4: カード画面が表示される

- ローディング画面が消える
- カードが表示される
- 「正解を見る」ボタンが表示される

---

## 🔍 トラブルシューティング

### 問題1: まだローディング画面が残る

**確認**:
```javascript
// F12 → Console
console.log(window.CARDS_SHEET_URL);
```

**期待される出力**:
```
https://docs.google.com/spreadsheets/d/1vPMvHQpzC190LwYTWepPlnDLsRfoT0OkWu4aU_oNipE/export?format=csv&gid=807901471
```

**対処**:
- URLが正しいか確認
- gid=807901471 が正しいか確認

### 問題2: エラーメッセージが表示される

**エラー**: 「タイムアウト: データ取得に時間がかかりすぎています」

**対処**:
- ネットワーク接続を確認
- Google Spreadsheetが公開されているか確認

**エラー**: 「CSVデータが空です」

**対処**:
- Spreadsheetの「単語カード」シートを確認
- データが入力されているか確認

### 問題3: コンソールにログが表示されない

**原因**: ブラウザのキャッシュ

**対処**:
```javascript
// F12 → Console
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

---

## 📝 技術的な解説

### なぜこの問題が起きたか

1. **以前の実装**:
   - ホーム画面にカードボタンがあった
   - そのボタンは `startCardsSession('all')` を呼んでいた

2. **ナビゲーションバーへの移動**:
   - CARDボタンをヘッダーに追加
   - しかし、`showCardsScreen()` を呼ぶように設定してしまった
   - データロード処理をスキップしてしまった

3. **結果**:
   - 画面は切り替わるが、データがない
   - `displayCurrentCard()` がエラー
   - ローディング画面が残る

### 正しい実装パターン

```javascript
// ❌ 間違い: 画面だけ切り替え
onclick="showCardsScreen()"

// ✅ 正しい: データロード → 画面切り替え
onclick="startCardsSession('all')"
```

---

## 🎓 教訓

### 画面遷移の原則

1. **データが必要な画面**: データロード関数を呼ぶ
   ```javascript
   onclick="startCardsSession('all')"  // データロード + 画面遷移
   ```

2. **データが不要な画面**: 直接画面切り替え
   ```javascript
   onclick="showScreen('homeScreen')"  // 画面遷移のみ
   ```

### デバッグの原則

1. **コンソールログを確認**: 関数が呼ばれているか確認
2. **イベントハンドラーを確認**: HTMLのonclick属性を確認
3. **データフローを追跡**: データがどこから来るか確認

---

**実装完了**: 2026-02-07  
**動作確認**: HTMLの1行修正  
**トークン使用量**: 109,002 / 200,000

---

**ユーザーへ**: ページをリロードして、CARDボタンをもう一度クリックしてください。今度は以下が表示されるはずです：

1. **コンソールログ**: 「🎴 カードセッション開始処理」から始まる詳細なログ
2. **カード画面**: ローディング画面が消えて、カードが表示される
3. **エラーなし**: 赤いエラーメッセージがない

問題が解決しない場合は、コンソールのログをすべて教えてください。
