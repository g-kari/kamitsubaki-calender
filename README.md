# kamitsubaki-calender

React.js とGitHub Actions による自動日次更新機能を持つKAMITSUBAKI Studio イベントカレンダーです。

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

このカレンダーは、GitHub Actions を使用して外部ソースからイベントデータを取得し、ローカルに保存することでCORS（クロスオリジンリソースシェアリング）問題を解決しています。現在はReact.js を使用してより良いコンポーネント構成と状態管理を実現しています：

1. **GitHub Action** (`/.github/workflows/update-events.yml`) が日本時間午前9時に毎日実行
2. **取得スクリプト** (`/scripts/fetch-events.js`) がKAMITSUBAKI公式サイトから最新のイベントデータを取得
3. **ローカルストレージ** (`/data/events.json`) に取得したイベントデータを保存
4. **React ビルド** GitHub Action が React アプリケーションをビルドし、静的ファイルを更新
5. **Webアプリケーション** (`index.html`) がローカルJSONファイルからイベントデータを読み込むReact製カレンダーを提供

## セットアップ

このアプリケーションは開発にNode.js とnpmが必要です。ビルド済みアプリケーションは、提供されている初期イベントデータですぐに動作します。GitHub Action が毎日自動的にイベントデータを更新し、React アプリケーションを再ビルドします。

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

アプリケーションは GitHub Actions によって自動的にビルド・デプロイされます。手動デプロイの場合：

```bash
# React アプリケーションをビルド
npm run build

# ビルド成果物をルートにコピー（GitHub Pages用）
cp dist/index-react.html index.html
cp -r dist/assets assets/
```

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
- `index-vanilla.html` - 元のバニラHTML/JS実装（保持）
- `index.html` - ビルドされたReactアプリケーション（自動生成）
- `assets/` - ビルド成果物（自動生成）

### データ & アクション
- `.github/workflows/update-events.yml` - 毎日の更新とReactビルドのためのGitHub Actionsワークフロー  
- `.github/pull_request_template.md` - スクリーンショット要件付きプルリクエストテンプレート
- `scripts/fetch-events.js` - イベントデータを取得するNode.jsスクリプト
- `data/events.json` - ローカルイベントデータストレージ
- `public/data/events.json` - Reactアプリ用のパブリックイベントデータ

### 設定
- `.gitignore` - node_modulesとビルド成果物を除外（ただし必要なファイルは保持）

## ライセンス

MIT License - 詳細はLICENSEファイルを参照してください。