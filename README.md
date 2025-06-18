# kamitsubaki-calender

React.js とGitHub Actions による自動日次更新機能を持つKAMITSUBAKI Studio イベントカレンダーです。

🌐 **ライブサイト**: [https://g-kari.github.io/kamitsubaki-calender/](https://g-kari.github.io/kamitsubaki-calender/)

## 機能

- 🌸 KAMITSUBAKI Studio アーティストのイベント表示
- 🔄 GitHub Actions による自動日次更新
- 📱 モバイル・デスクトップ対応のレスポンシブデザイン
- 🎯 イベントのフィルタリングと検索
- 📧 メール通知の購読
- 📊 イベント統計
- 📅 iCalエクスポート対応
- ⚛️ **新機能:** パフォーマンスと保守性を向上させるReact.js製

## 仕組み

このカレンダーは、GitHub Actions を使用して外部ソースからイベントデータを取得し、ローカルに保存することでCORS（クロスオリジンリソースシェアリング）問題を解決しています。現在はReact.js を使用してより良いコンポーネント構成と状態管理を実現し、GitHub Pages で自動デプロイされています：

1. **GitHub Action** (`/.github/workflows/update-events.yml`) が日本時間午前9時に毎日実行
2. **取得スクリプト** (`/scripts/fetch-events.js`) がKAMITSUBAKI公式サイトから最新のイベントデータを取得
3. **ローカルストレージ** (`/data/events.json`) に取得したイベントデータを保存
4. **React ビルド** GitHub Action が React アプリケーションをビルドし、静的ファイルを更新
5. **GitHub Pages デプロイ** (`/.github/workflows/deploy-pages.yml`) が main ブランチへの push 時に自動実行
6. **Webアプリケーション** GitHub Pages でホストされる React 製カレンダーがローカル JSON ファイルからイベントデータを読み込み

## セットアップ

このアプリケーションは開発にNode.js とnpmが必要です。GitHub Pages で自動デプロイされたライブサイトは [https://g-kari.github.io/kamitsubaki-calender/](https://g-kari.github.io/kamitsubaki-calender/) でアクセスできます。

### 本番デプロイ（GitHub Pages）

本プロジェクトは GitHub Pages を使用して自動デプロイされます：

- **ライブサイト**: [https://g-kari.github.io/kamitsubaki-calender/](https://g-kari.github.io/kamitsubaki-calender/)
- **自動デプロイ**: main ブランチへの push 時に `.github/workflows/deploy-pages.yml` が実行
- **イベントデータ更新**: 毎日午前9時（JST）に `.github/workflows/update-events.yml` が実行

### 開発環境のセットアップ

```bash
# 依存関係をインストール
npm install

# 開発サーバーを開始
npm run dev

# 本番用ビルド
npm run build
```

### 手動テスト

更新スクリプトを手動で実行するには：

```bash
npm install cheerio node-fetch@2
node scripts/fetch-events.js
```

### ビルドとデプロイ

#### GitHub Pages（推奨）

本プロジェクトは GitHub Pages で自動デプロイされます：

1. main ブランチに変更をプッシュ
2. `.github/workflows/deploy-pages.yml` が自動実行
3. Vite でビルドし、GitHub Pages にデプロイ
4. [https://g-kari.github.io/kamitsubaki-calender/](https://g-kari.github.io/kamitsubaki-calender/) でライブサイトにアクセス可能

#### 手動デプロイ

手動でビルドする場合：

```bash
# React アプリケーションをビルド
npm run build

# ビルド成果物を確認
ls dist/
```

**注意**: GitHub Pages デプロイは自動化されているため、通常は手動デプロイは不要です。

### テスト (Playwright + MCP)

このプロジェクトは GitHub Copilot との連携のために Playwright MCP (Model Context Protocol) に対応しています：

```bash
# Playwright テストを実行
npm test

# ヘッド付きモードでテスト実行 (ブラウザが見える)
npm test:headed

# インタラクティブなデバッグモード
npm test:debug

# テスト UI を使用
npm test:ui

# テストレポートを表示
npm test:report

# MCP サーバーを起動 (GitHub Copilot 用)
npm run mcp-server
```

詳細な MCP 使用方法については [COPILOT_MCP.md](./COPILOT_MCP.md) を参照してください。

## 貢献について

### プルリクエスト要件

**📸 スクリーンショットが必要**

ユーザーインターフェースを変更するプルリクエストを提出する際は、**必ず**スクリーンショットを含める必要があります：

- **変更前**: 現在の状態を示すスクリーンショット（該当する場合）
- **変更後**: 変更内容を示すスクリーンショット（必須）

これにより、レビュアーが変更の視覚的影響を理解し、ユーザーインターフェースの品質管理を確保できます。

プルリクエストテンプレートが必要な情報とスクリーンショット形式をガイドします。

### ガイドライン

- 既存のコードスタイルと構造に従う
- 可能であれば異なるブラウザでの変更をテストする
- 新機能には適切なコメントを含める
- モバイルとデスクトップでレスポンシブデザインが動作することを確認する
- **[スクリーンショットガイド](.github/SCREENSHOT_GUIDE.md)を読む** - スクリーンショットの撮影とアップロードの詳細な手順

## ファイル

### React アプリケーション
- `src/App.jsx` - メインのReactアプリケーションコンポーネント
- `src/components/` - Reactコンポーネント (Header, EventCard, CalendarView等)
- `src/App.css` - Reactアプリケーションのスタイリング
- `package.json` - Node.js依存関係とビルドスクリプト
- `vite.config.js` - Viteビルド設定

### レガシー & ビルド
- `index.html` - React アプリケーションの開発テンプレート（ビルド時は自動生成される）
- `assets/` - ビルド成果物（自動生成）

### データ & アクション
- `.github/workflows/update-events.yml` - 毎日の更新とReactビルドのためのGitHub Actionsワークフロー
- `.github/workflows/deploy-pages.yml` - GitHub Pages自動デプロイワークフロー
- `.github/pull_request_template.md` - スクリーンショット要件付きプルリクエストテンプレート
- `scripts/fetch-events.js` - イベントデータを取得するNode.jsスクリプト
- `data/events.json` - ローカルイベントデータストレージ
- `public/data/events.json` - Reactアプリ用のパブリックイベントデータ

### 設定
- `.gitignore` - node_modulesとビルド成果物を除外（ただし必要なファイルは保持）

## ライセンス

MIT License - 詳細はLICENSEファイルを参照してください。