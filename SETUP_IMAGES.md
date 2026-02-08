# キャラクター画像セットアップガイド

## 概要
このガイドでは、10キャラクターの画像をプロジェクトに追加する手順を説明します。

## 必要な画像ファイル

以下の10枚の画像が必要です（PNG形式、背景透過推奨）：

1. **ポチタ** - `images/characters/pochita.png`
2. **マキマ** - `images/characters/makima.png`
3. **アキ** - `images/characters/aki.png`
4. **パワー** - `images/characters/power.png`
5. **姫野** - `images/characters/himeno.png`
6. **コベニ** - `images/characters/kobeni.png`
7. **レゼ** - `images/characters/reze.png`
8. **ビーム** - `images/characters/beam.png`
9. **岸辺** - `images/characters/kishibe.png`
10. **チェンソーマン** - `images/characters/chainsaw.png`

## 画像仕様

- **サイズ**: 500×500px 推奨（正方形）
- **形式**: PNG（背景透過）
- **解像度**: 72-150 DPI
- **ファイルサイズ**: 100KB以下推奨

## セットアップ手順

### 方法1: 手動アップロード（推奨）

1. プロジェクトルートに `images` フォルダを作成
2. `images` 内に `characters` フォルダを作成
3. 10枚の画像を `images/characters/` フォルダに配置
4. ファイル名を上記リストに合わせる

### 方法2: AI Drive画像から自動生成（Python利用可能な場合）

```bash
# 依存パッケージのインストール
pip install rembg pillow

# 背景除去スクリプトを実行
python process_characters.py
```

## 画像がない場合の動作

画像ファイルが見つからない場合、自動的に絵文字フォールバックが表示されます：

- 🐕 ポチタ
- 👁️ マキマ
- 🗡️ アキ
- 🩸 パワー
- 👻 姫野
- 😰 コベニ
- 💣 レゼ
- 🦈 ビーム
- 🥃 岸辺
- 🪚 チェンソーマン

## 背景除去スクリプト（オプション）

AI Drive上の画像から背景を自動除去するPythonスクリプト:

```python
# process_characters.py
from rembg import remove
from PIL import Image
import os

# AI Drive上のパス
AI_DRIVE_BASE = "/mnt/aidrive/chainsaw_man_images"

# 出力先
OUTPUT_DIR = "./images/characters"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# キャラクター定義
CHARACTERS = {
    'pochita': ('ポチタ', '001_56c00a62.jpg'),
    'makima': ('マキマ', '001_3e60b875.jpg'),
    'aki': ('早川アキ', '001_1cc3517f.jpg'),
    'power': ('パワー', '001_6335dc07.jpg'),
    'himeno': ('姫野', '001_9749797f.jpg'),
    'kobeni': ('コベニ', '001_c6234632.jpg'),
    'reze': ('レゼ', '001_c24cfcf9.jpg'),
    'beam': ('ビーム', '001_12fa6b9e.jpg'),
    'kishibe': ('岸辺', '001_b138ae5c.jpg'),
    'denji': ('デンジ', '001_5f33a725.jpg')
}

# 画像を処理
for char_id, (char_name_jp, filename) in CHARACTERS.items():
    input_path = os.path.join(AI_DRIVE_BASE, char_name_jp, filename)
    output_path = os.path.join(OUTPUT_DIR, f"{char_id}.png")
    
    if not os.path.exists(input_path):
        print(f"⚠️  画像が見つかりません: {input_path}")
        continue
    
    try:
        # 画像を読み込み
        with open(input_path, 'rb') as f:
            input_img = f.read()
        
        # 背景を除去
        output_img = remove(input_img)
        
        # PILで開く
        img = Image.open(io.BytesIO(output_img))
        
        # 500x500にリサイズ（アスペクト比維持）
        img.thumbnail((500, 500), Image.Resampling.LANCZOS)
        
        # 透過PNGとして保存
        img.save(output_path, 'PNG')
        
        print(f"✅ {char_name_jp} ({char_id}.png) 処理完了")
        
    except Exception as e:
        print(f"❌ {char_name_jp} 処理エラー: {e}")

print("\n✨ 全処理完了！")
```

## 動作確認

1. ブラウザで `index.html` を開く
2. ホーム画面のステージカードを確認
3. 画像が表示されていることを確認
4. ホバーエフェクト（拡大・回転）を確認
5. ロック状態のグレースケール表示を確認

## トラブルシューティング

### 画像が表示されない

- ファイルパスが正しいか確認
- ファイル名が小文字か確認（pochita.png、makima.png など）
- ブラウザのキャッシュをクリア
- コンソールエラーを確認（F12 → Console）

### 画像が粗い・低解像度

- 画像サイズを大きくする（1000×1000px など）
- PNG形式を使用
- 圧縮を最小限にする

### 背景が透過されていない

- PNG形式で保存されているか確認
- 画像編集ソフトで背景を手動削除
- rembg を使った自動除去を試す

## 次のステップ

画像セットアップが完了したら：

1. ブラウザでデザインを確認
2. モバイル表示をテスト
3. 学習画面の動作確認
4. デプロイ（Publishタブ）

---

**注意**: 画像の著作権に注意してください。公式素材またはオリジナル作成の素材のみを使用してください。
