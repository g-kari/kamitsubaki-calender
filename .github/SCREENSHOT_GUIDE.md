# スクリーンショット ガイド / Screenshot Guide

## 📸 なぜスクリーンショットが必要か / Why Screenshots Are Required

KAMITSUBAKI カレンダーは視覚的なWebアプリケーションです。UIの変更がユーザー体験に与える影響を正確に評価するため、すべてのUIに関連する変更には**修正後のスクリーンショット**の添付が必要です。

The KAMITSUBAKI calendar is a visual web application. To accurately assess the impact of UI changes on user experience, **after screenshots** are required for all UI-related modifications.

## 📋 いつスクリーンショットが必要か / When Screenshots Are Required

以下のファイルを変更する場合、スクリーンショットが必要です：

Screenshots are required when modifying these files:
- `index.html` - メインのWebアプリケーション / Main web application
- CSSスタイルの変更 / CSS style changes
- UIに影響するJavaScriptの変更 / JavaScript changes affecting UI

## 📷 スクリーンショットの撮り方 / How to Take Screenshots

### デスクトップ / Desktop
1. ブラウザでアプリケーションを開く / Open the application in your browser
2. 変更した部分が見えるようにスクロール / Scroll to show the changed area
3. スクリーンショットを撮影：
   - **Windows**: `Windows + Shift + S` または Snipping Tool
   - **Mac**: `Cmd + Shift + 4` で範囲選択
   - **Linux**: `gnome-screenshot` または `spectacle`

### モバイル表示 / Mobile View
1. ブラウザの開発者ツールを開く / Open browser developer tools
2. モバイルビューに切り替え / Switch to mobile view
3. 適切なデバイスサイズを選択 / Select appropriate device size
4. スクリーンショットを撮影 / Take screenshot

## 📤 スクリーンショットのアップロード方法 / How to Upload Screenshots

### GitHub直接アップロード / Direct GitHub Upload
1. Pull Requestの説明欄をクリック / Click on PR description field
2. 画像ファイルをドラッグ&ドロップ / Drag & drop image files
3. 自動生成されるMarkdownリンクをコピー / Copy the auto-generated Markdown links

例 / Example:
```markdown
### 修正後 / After
![Screenshot after changes](https://github.com/user/repo/assets/12345/screenshot.png)
```

### 推奨画像形式 / Recommended Image Formats
- **PNG** - UI要素がクリアに表示 / Clear display of UI elements
- **JPG** - ファイルサイズが小さい / Smaller file size
- **WebP** - 最適な圧縮と品質 / Optimal compression and quality

## ✅ 良いスクリーンショットの例 / Good Screenshot Examples

### ✅ 適切な例 / Good Example
```markdown
### 修正前 / Before
![Before: Old calendar layout](https://user-images.githubusercontent.com/example-before.png)

### 修正後 / After  
![After: New calendar layout with improved styling](https://user-images.githubusercontent.com/example-after.png)
```

### ❌ 不適切な例 / Bad Examples
```markdown
### 修正後 / After
画像を添付しました / I attached an image
（実際の画像がない / No actual image）
```

## 🔍 スクリーンショットに含めるべき内容 / What to Include in Screenshots

### デスクトップ表示 / Desktop View
- 変更した部分を中心に / Focus on the changed area
- 十分な周辺コンテキスト / Sufficient surrounding context
- ブラウザのアドレスバーは不要 / Browser address bar not needed

### モバイル表示 / Mobile View
- レスポンシブデザインの変更がある場合 / When responsive design changes are made
- 縦表示と横表示の両方（必要に応じて）/ Portrait and landscape (if needed)

## 🚀 自動チェック / Automated Checks

プルリクエストを作成すると、以下が自動でチェックされます：

When you create a pull request, the following are automatically checked:
- UIファイルの変更の検出 / Detection of UI file changes
- スクリーンショットの存在確認 / Verification of screenshot presence
- 適切なセクションの使用 / Proper section usage

スクリーンショットが不足している場合、ボットがコメントで通知します。

If screenshots are missing, a bot will notify you with a comment.

## 💡 Tips

- **複数の変更**: 複数の変更がある場合は、それぞれにスクリーンショットを提供
- **アニメーション**: 動的な変更の場合はGIFを使用可能
- **エラー状態**: エラー表示の変更も含める
- **ダークモード**: ダークモード対応の場合は両方のモードのスクリーンショット

---

質問がある場合は、Issueで気軽にお尋ねください！

If you have questions, feel free to ask in an Issue!