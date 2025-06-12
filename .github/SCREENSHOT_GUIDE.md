# スクリーンショット ガイド / Screenshot Guide

## 🤖 自動スクリーンショット機能 / Automated Screenshot Feature

**新機能: 自動スクリーンショット撮影**
このリポジトリでは、UIに関連するファイルを変更するプルリクエストで**自動的にスクリーンショットが撮影**されます！

**New Feature: Automated Screenshot Capture**
This repository now **automatically captures screenshots** for pull requests that modify UI-related files!

### 対象ファイル / Target Files
- `index.html` - メインのWebアプリケーション / Main web application
- `**/*.css` - CSSスタイルファイル / CSS style files  
- `**/*.js` - JavaScriptファイル / JavaScript files
- `data/events.json` - イベントデータ / Event data

### 自動撮影内容 / What's Automatically Captured
- 📱 **モバイル表示** (375x667) / Mobile view
- 🖥️ **デスクトップ表示** (1280x720) / Desktop view
- 🔄 **修正前後の比較** / Before and after comparison

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

> **注意**: 自動スクリーンショット機能により、手動でのスクリーンショット撮影は**任意**になりました。  
> **Note**: With the automated screenshot feature, manual screenshot capture is now **optional**.

自動スクリーンショットで十分でない場合や、特定の状態を示したい場合のみ手動撮影を行ってください。

Manual screenshots are only needed when automated screenshots are insufficient or when showing specific states.

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

> **自動スクリーンショットの場合**: システムが自動的に適切な範囲をキャプチャします。  
> **For automated screenshots**: The system automatically captures the appropriate scope.

### 手動スクリーンショットの場合 / For Manual Screenshots

### デスクトップ表示 / Desktop View
- 変更した部分を中心に / Focus on the changed area
- 十分な周辺コンテキスト / Sufficient surrounding context
- ブラウザのアドレスバーは不要 / Browser address bar not needed

### モバイル表示 / Mobile View
- レスポンシブデザインの変更がある場合 / When responsive design changes are made
- 縦表示と横表示の両方（必要に応じて）/ Portrait and landscape (if needed)

## 🚀 自動チェック / Automated Checks

プルリクエストを作成すると、以下が自動でチェック・実行されます：

When you create a pull request, the following are automatically checked and executed:

### 自動スクリーンショット撮影 / Automated Screenshot Capture
- 🎯 UIファイルの変更を検出 / Detect UI file changes
- 📸 デスクトップとモバイルのスクリーンショットを自動撮影 / Automatically capture desktop and mobile screenshots  
- 🔄 修正前後の比較画像を生成 / Generate before/after comparison images
- 💬 PRに自動コメントで結果を投稿 / Post results as automated comment on PR
- 💾 スクリーンショットをArtifactsとして保存 / Save screenshots as workflow artifacts

### スクリーンショット検証 / Screenshot Validation  
- ✅ 自動または手動スクリーンショットの存在確認 / Verify presence of automated or manual screenshots
- 🔍 適切なセクションの使用チェック / Check proper section usage

スクリーンショットが不足している場合や自動撮影に失敗した場合、ボットがコメントで通知します。

If screenshots are missing or automated capture fails, a bot will notify you with a comment.

## 💡 Tips

### 自動スクリーンショット使用時 / When Using Automated Screenshots
- **ワークフロー確認**: PRページの "Actions" タブで撮影状況を確認
- **Artifacts ダウンロード**: 高解像度画像が必要な場合はArtifactsからダウンロード  
- **手動補完**: 特定の操作状態や エラー状態を示したい場合は手動スクリーンショットを追加

### 手動スクリーンショット使用時 / When Using Manual Screenshots
- **複数の変更**: 複数の変更がある場合は、それぞれにスクリーンショットを提供
- **アニメーション**: 動的な変更の場合はGIFを使用可能
- **エラー状態**: エラー表示の変更も含める
- **ダークモード**: ダークモード対応の場合は両方のモードのスクリーンショット

### トラブルシューティング / Troubleshooting
- **自動撮影失敗**: Actionsタブでログを確認、必要に応じて手動スクリーンショットを追加
- **撮影対象外ファイル**: 自動撮影対象外のファイル変更の場合は手動スクリーンショットが必要

---

質問がある場合は、Issueで気軽にお尋ねください！

If you have questions, feel free to ask in an Issue!