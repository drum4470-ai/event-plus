# Event-Plus | イベント管理・施設予約システム

[![Laravel](https://img.shields.io/badge/Laravel-13.9.0-red?logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.4.21-blue?logo=php)](https://php.net)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)

## プロジェクト概要
Event-Plusは、公共施設の利用申請およびイベント管理業務をデジタル化し、業務効率化とリードタイムの劇的な短縮を実現する管理プラットフォームです。

これまで手書き申請やアナログな承認フローによって発生していた「申請の差し戻し」「進行状況の不透明さ」「承認のバラつき」といった課題を、システムによるバリデーションとステータス可視化によって解決します。

## 主な解決課題
* **業務負担の低減**: 申請入力時のバリデーションにより、不備による差し戻しを最小化。
* **進捗の可視化**: 申請から承認までのステータスをリアルタイムで追跡し、計画的なイベント準備を支援。
* **承認プロセスの最適化**: アナログな連絡を廃止し、システム上で完結することで担当者間の連携ミスを防止。

## 技術スタック
本プロジェクトは、保守性と拡張性を考慮し、以下の技術を採用しています。

* **Backend**: [Laravel 13.9.0](https://laravel.com) (PHP 8.4.21)
* **Frontend**: [React](https://react.dev) + [Inertia.js](https://inertiajs.com)
* **Styling**: [Tailwind CSS](https://tailwindcss.com)
* **Database**: SQLite

## 主な機能
- **認証システム**: 管理者アカウントによるセキュアなアクセス制御。
- **アカウント管理**: ユーザー情報の登録と権限設定。
- **リソース管理**: 建物・施設・設備の登録・編集・紐付け管理。
- **申請ワークフロー**: ステータス管理によるイベント企画のステータス追跡。

## 開発環境のセットアップ

### 前提条件
- PHP 8.4+
- Composer
- Node.js & npm

### 手順

1. **リポジトリのクローン**
   ```bash
   git clone [https://github.com/drum4470-ai/event-plus](https://github.com/drum4470-ai/event-plus)
   cd event-plus

2. **依存関係のインストール**
composer install
npm install

3. **環境設定・DB準備**
cp .env.example .env
php artisan key:generate
php artisan migrate

4. **サーバーの起動**
php artisan serve # ターミナル1
npm run dev       # ターミナル2


### ディレクトリ構成
.
├── app/
│   ├── Http/Controllers/    # コントローラー：Admin用(Master/Relation)とUser用に分類
│   └── Models/              # データベースモデル
├── resources/
│   ├── js/
│   │   ├── Components/      # 再利用可能な共通UIコンポーネント
│   │   ├── Hooks/           # 状態管理やバリデーションのカスタムフック
│   │   ├── Layouts/         # ページレイアウト（Admin, Authenticated等）
│   │   ├── Pages/           # Inertiaページ(Reactコンポーネント)
│   │   └── Utils/           # 共通関数
│   └── views/               # Bladeテンプレート
├── routes/
│   └── web.php              # ルーティング定義
└── ...

###  構成は順次追加予定

## Gitコミットメッセージの規約（Conventional Commits）

形式： <type>: <description>

feat: 機能の追加

fix: バグ修正

docs: ドキュメントのみの変更

refactor: 機能変更もバグ修正もしないコードの改善（リファクタリング）

style: コードの意味を変えない変更（スペース、書式設定など）


## TODOの管理: 未実装機能はリスト。

[ ] Layout.jsxの作成

[ ] コントローラーの再構築

# License
The Laravel framework is open-sourced software licensed under the MIT license.
