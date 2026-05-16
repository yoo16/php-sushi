# Backend Migration Tasks

## Phase 1

- [ ] Laravel 基盤を `backend/` に導入する
- [ ] `.env` と DB 接続設定を Laravel へ寄せる
- [ ] `schema.sql` 相当の migration を作る
- [ ] `insert_data.sql` 相当の seeder を作る

## Phase 2

- [ ] `Category`, `Product`, `Seat`, `Visit`, `Order` の Eloquent model を作る
- [ ] relation を定義する
- [ ] `/api/*.php` の互換ルートを定義する
- [ ] カテゴリ、商品、席、来店、注文 API を Laravel へ移す

## Phase 3

- [ ] 管理画面の dashboard を移行する
- [ ] category CRUD を移行する
- [ ] product CRUD を移行する
- [ ] seat 管理を移行する
- [ ] visit 一覧と詳細を移行する

## Phase 4

- [ ] 商品画像アップロードを Laravel Storage へ移す
- [ ] CSV エクスポートを移行する
- [ ] QR コード生成を Service 化して移行する
- [ ] 旧ネイティブ PHP 依存を除去する

## Verification

- [ ] API Feature Test を追加する
- [ ] 会計計算のテストを追加する
- [ ] 管理画面主要導線のテストを追加する
- [ ] フロントエンドの注文導線で実動確認する
