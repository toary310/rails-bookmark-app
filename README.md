# Grok AI チャットボット

Next.js 14（App Router）を使用したAIチャットボットインターフェース。xAIのGrok APIと統合し、リアルタイムでAIと対話できます。

## 機能

- Grok API統合によるAIチャット機能
- Tailwind CSSを使用したモダンなUI
- ダーク/ライトモード切り替え
- ローカルストレージによる会話履歴の保存
- レスポンシブデザイン（モバイル対応）
- Web Speech APIを使用した音声入力機能

## セットアップ方法

### 前提条件

- Node.js 18.0.0以上
- Grok API キー（[https://x.ai/api](https://x.ai/api)から取得）

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd grok-chat-app
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数の設定
`.env.local`ファイルをプロジェクトのルートに作成し、以下の内容を追加：
```
NEXT_PUBLIC_GROK_API_URL=https://api.x.ai
NEXT_PUBLIC_GROK_API_KEY=your_grok_api_key_here
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

### 本番用ビルド

```bash
npm run build
```

### 本番モードでの実行

```bash
npm start
```

## Vercelへのデプロイ

このプロジェクトは[Vercel](https://vercel.com)へ簡単にデプロイできます。

1. [Vercel](https://vercel.com)にアカウントを作成
2. プロジェクトをインポート
3. 環境変数`NEXT_PUBLIC_GROK_API_KEY`を設定
4. デプロイ

## 技術スタック

- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
