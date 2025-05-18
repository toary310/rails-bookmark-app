# ブックマーク・記事クリッピングアプリ

## 概要

このアプリケーションは、Web上の記事やページをブックマークとして効率的に保存・管理するためのものです。ユーザーはURL、タイトル、個人的なメモを記録し、後で簡単に見返すことができます。

## 主な機能

*   ブックマークの登録（URL、タイトル、メモ）
*   ブックマークの一覧表示
*   GraphQL APIによるCRUD操作（作成、読み取り、更新、削除）

将来的には、検索機能、タグ付け、ユーザー認証などの機能拡張を検討しています。

## プロジェクト構成

本プロジェクトは、バックエンドAPIとフロントエンドUIが分離された構成になっています。

*   **バックエンド (API):** `bookmark_app/`
    *   Ruby on RailsによるGraphQL APIサーバーです。
*   **フロントエンド (UI):** `bookmark_app/client/bookmark-ui/`
    *   React (Vite + TypeScript) で構築されたSPA (Single Page Application) です。

## 技術スタック

### バックエンド

*   **Ruby:** 3.2.3
*   **Ruby on Rails:** 8.0.2
*   **GraphQL:** `graphql-ruby` gem
*   **データベース:** PostgreSQLを想定
*   **CORS/CSRF対応:** `rack-cors` gem など

### フロントエンド

*   **React:** v18.2.0
*   **TypeScript:** v5.8.3
*   **Vite:** v6.3.5 (高速なフロントエンドビルドツール)
*   **Apollo Client:** v3.13.8 (GraphQLクライアントライブラリ)
*   **CSS:** CSS Modules (コンポーネントスコープのCSS)
*   **Linting/Formatting:** ESLint

## セットアップと実行方法

### 1. バックエンド (Ruby on Rails API)

1.  **リポジトリのクローン:**
    ```bash
    git clone <repository_url>
    cd <repository_name>/bookmark_app
    ```
2.  **Rubyのバージョン確認・インストール:**
    *   `.ruby-version` ファイルで指定されたRubyのバージョンがインストールされていることを確認してください。必要に応じて `rbenv` や `rvm` でインストールします。
3.  **依存関係のインストール:**
    ```bash
    bundle install
    ```
4.  **データベースのセットアップ:**
    ```bash
    rails db:create
    rails db:migrate
    # (もしあれば) rails db:seed
    ```
5.  **バックエンドサーバーの起動:**
    ```bash
    rails s
    ```
    サーバーはデフォルトで `http://localhost:3000` で起動します。

### 2. フロントエンド (React App)

1.  **フロントエンドディレクトリへ移動:**
    ```bash
    cd client/bookmark-ui
    ```
2.  **Node.js / npm のバージョン確認・インストール:**
    *   適切なバージョンのNode.jsとnpm (またはyarn) がインストールされていることを確認してください。
3.  **依存関係のインストール:**
    ```bash
    npm install
    # または yarn install
    ```
4.  **開発サーバーの起動:**
    ```bash
    npm run dev
    # または yarn dev
    ```
    開発サーバーは通常 `http://localhost:5173` (Viteのデフォルト) などで起動します。

## APIエンドポイント

*   **GraphQL:** `http://localhost:3000/graphql`
    *   このエンドポイントに対して、フロントエンドからクエリやミューテーションを送信します。
    *   GraphiQL (または同様のツール) を使用して `http://localhost:3000/graphiql` (もし有効化されていれば) からAPIを直接テストすることも可能です。

---
