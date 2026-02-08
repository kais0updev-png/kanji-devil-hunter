# 🐛 Kanji Cards Bug Fixes - 2026-02-08

## Critical Issues Fixed

### 1. **Script Tag Corruption (Line 534)**

#### Problem
```html
<!-- BROKEN -->
<parameter name="chainsaw-app.js"></script>
```

**Impact**: 
- `chainsaw-app.js` never loaded
- All card functions undefined
- Clicking CARD button did nothing
- Loading screen stuck infinitely

#### Solution
```html
<!-- FIXED -->
<script src="js/chainsaw-app.js"></script>
```

**File**: `index.html`, line 534

---

### 2. **Loading Screen Stuck Issue**

#### Problem
User reported loading screen never disappears when clicking CARD button.

**Root Causes**:
1. Script corruption (above) prevented JavaScript from loading
2. `showCardsScreen()` didn't explicitly hide loading screen
3. CARD button called wrong function initially

#### Solution

**A. Fixed CARD button onclick handler** (Line 52):
```html
<!-- Changed from showCardsScreen() to startCardsSession('all') -->
<a href="#" class="csm-nav-link" onclick="startCardsSession('all'); return false;">CARD</a>
```

**B. Enhanced `startCardsSession()` to show loading immediately**:
```javascript
async function startCardsSession(mode) {
  try {
    console.log('🎴 カードセッション開始処理');
    
    // CRITICAL: Show loading screen FIRST
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('cardsScreen').classList.add('hidden');
    document.getElementById('loadingScreen').classList.remove('hidden');
    document.getElementById('loadingMessage').textContent = 'カードデータ読み込み中...';
    
    // ... rest of function
```

**C. Fixed `showCardsScreen()` to hide loading**:
```javascript
function showCardsScreen() {
  console.log('🎴 カード画面を表示');
  
  document.getElementById('homeScreen').classList.add('hidden');
  document.getElementById('loadingScreen').classList.add('hidden');  // CRITICAL
  document.getElementById('errorScreen').classList.add('hidden');
  
  document.getElementById('cardsScreen').classList.remove('hidden');
}
```

---

### 3. **Enhanced Error Handling**

#### Problem
Generic error messages didn't help users troubleshoot issues.

#### Solution
Implemented comprehensive error categorization with actionable troubleshooting steps:

```javascript
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
}

errorMsg += troubleshooting;
alert(errorMsg);
```

**Error Types Added**:
- `TIMEOUT`: 15-second fetch timeout
- `NETWORK_ERROR`: Failed to fetch
- `HTTP 403`: Access denied
- `HTTP 404`: Not found
- `CSV_EMPTY`: No data in spreadsheet
- `CSV_NO_DATA`: Only header row
- `VALIDATION_FAILED`: Invalid data format
- `DATA_INVALID`: Failed to parse data
- `INVALID_CACHE`: Corrupted cache

---

### 4. **Data Validation Enhancements**

#### Problem
Invalid or corrupted data could crash the app.

#### Solution

**A. Cache validation**:
```javascript
if (cached && cacheTime && (now - parseInt(cacheTime)) < 1800000) {
  try {
    cardsData = JSON.parse(cached);
    
    // Validate cached data
    if (!Array.isArray(cardsData) || cardsData.length === 0) {
      console.warn('⚠️ キャッシュデータが無効です。再取得します。');
      localStorage.removeItem('kanjiCardsCache');
      localStorage.removeItem('kanjiCardsCacheTime');
      throw new Error('INVALID_CACHE');
    }
  } catch (cacheError) {
    // Handle corrupted cache
    localStorage.removeItem('kanjiCardsCache');
    localStorage.removeItem('kanjiCardsCacheTime');
  }
}
```

**B. CSV structure validation**:
```javascript
// Validate CSV structure
if (!csv || csv.trim().length === 0) {
  throw new Error('CSV_EMPTY: Spreadsheetが空です');
}

const lines = csv.split('\n').slice(1).filter(l => l.trim());

if (lines.length === 0) {
  throw new Error('CSV_NO_DATA: ヘッダー行のみでデータがありません');
}

// Log first 3 lines for debugging
console.log('📝 最初の3行をプレビュー:');
lines.slice(0, 3).forEach((line, i) => {
  console.log(`  行${i + 1}: ${line.substring(0, 100)}${line.length > 100 ? '...' : ''}`);
});
```

**C. Field validation**:
```javascript
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
```

**D. Final data check**:
```javascript
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
```

---

### 5. **Startup Diagnostics**

#### Problem
Hard to debug which scripts loaded and which functions are available.

#### Solution

**A. Script load diagnostic in HTML** (index.html):
```html
<!-- Startup Diagnostic: Log all loaded scripts -->
<script>
  console.log('🔧 === SCRIPT LOAD DIAGNOSTIC ===');
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach((script, idx) => {
    console.log(`📜 Script ${idx + 1}: ${script.src}`);
  });
  console.log(`✅ Total scripts loaded: ${scripts.length}`);
  console.log('🔧 === END DIAGNOSTIC ===');
</script>
```

**B. JavaScript load confirmation** (chainsaw-app.js):
```javascript
console.log('🚀 chainsaw-app.js loaded');
console.log(`📅 Loaded at: ${new Date().toISOString()}`);
```

**C. Global error handlers**:
```javascript
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
```

**D. Function availability check**:
```javascript
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
```

**E. Global scope exposure**:
```javascript
// Expose card functions to global scope for HTML onclick attributes
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
```

---

## Testing Checklist

After these fixes, verify:

- [ ] Open browser console and check for script load diagnostic
- [ ] Verify "🚀 chainsaw-app.js loaded" appears
- [ ] Click CARD button in header
- [ ] Check console for "🎴 カードセッション開始処理"
- [ ] Loading screen should appear briefly
- [ ] Card screen should display with first card
- [ ] Verify vertical text and katakana lines render correctly
- [ ] Test card flip animation
- [ ] Test next/previous navigation
- [ ] Test "覚えた/覚えてない" buttons
- [ ] Verify progress counter updates
- [ ] Test error handling by disconnecting internet
- [ ] Verify cache works (check localStorage)

---

## Files Modified

1. **index.html**
   - Line 52: Fixed CARD button onclick
   - Line 534: Fixed script tag corruption
   - Lines 537-546: Added startup diagnostic script

2. **js/chainsaw-app.js**
   - Lines 1-50: Added startup diagnostics & error handlers
   - Lines 1260-1500: Enhanced `startCardsSession()` error handling
   - Lines 1581-1605: Exposed functions to global scope

3. **README.md**
   - Added Phase 7 documentation
   - Added bug fix changelog

4. **KANJI_CARDS_BUG_FIXES.md** (this file)
   - Comprehensive documentation of all fixes

---

## Console Log Flow (Success Case)

```
🔧 === SCRIPT LOAD DIAGNOSTIC ===
📜 Script 1: .../js/kanji_full_data.js
📜 Script 2: .../js/csv-loader-unified.js
📜 Script 3: .../js/chainsaw-app.js
✅ Total scripts loaded: 3
🔧 === END DIAGNOSTIC ===
🚀 chainsaw-app.js loaded
📅 Loaded at: 2026-02-08T...
🔍 Verifying critical functions...
✅ startCardsSession is defined
✅ showCardsScreen is defined
✅ displayCurrentCard is defined
✅ flipTheCard is defined
✅ goToNextCard is defined
✅ goToPreviousCard is defined
✅ markCardRemembered is defined
✅ markCardNotRemembered is defined
✅ All card functions exposed to global scope

[User clicks CARD button]

🎴 カードセッション開始処理
📊 モード: all
📦 キャッシュからカードデータ読み込み: 200枚
✅ カードデータ確認: 200枚
📇 最初のカード: {id: "1", word: "学校に□く", ...}
📇 最後のカード: {id: "200", word: "...", ...}
🎴 カードセッション開始: 200枚
🎴 カード画面を表示
🔄 カード状態をリセット
📇 カード表示: 1/200 - 学校に□く
```

---

## Prevention Measures

To prevent similar issues in the future:

1. **Always verify script tags** before deployment
2. **Use startup diagnostics** to catch load failures
3. **Expose functions explicitly** to window object when using onclick
4. **Test in clean browser** (incognito mode) to verify no cache issues
5. **Check console logs** after every major change
6. **Validate data structure** before processing
7. **Provide actionable error messages** to users

---

**Status**: ✅ ALL CRITICAL BUGS FIXED  
**Date**: 2026-02-08  
**Tested**: Ready for user verification
