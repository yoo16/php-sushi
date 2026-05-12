# Frontend Spec

## 目的

既存の注文 UI を、`Vite + React` ベースのフロントエンドへ置き換えやすい状態にする。初回の対象は、現在 `app/views/home/menu.php` と `js/app.js` が担っている注文画面とする。

## スコープ

- 注文画面の React 化
- 既存 API の利用
- Vite による開発環境とビルド環境の整備
- PHP テンプレートからビルド済みアセットを読み込む仕組みの追加

## スコープ外

- 管理画面の React 化
- API レスポンス仕様の大幅変更
- DB スキーマ変更
- 決済フローの再設計

## 現状のソース対応

- 画面テンプレート: `app/views/home/menu.php`
- 既存フロントロジック: `js/app.js`
- 共通 head: `app/views/components/head.php`

## 採用方針

- React は関数コンポーネントで実装する
- 状態管理はまず React 標準機能で完結させる
- API 通信は `fetch` を使う
- Tailwind CDN 依存から脱却し、Vite 側で CSS を管理できる形へ寄せる
- 既存 PHP ルーティングは維持し、画面のエントリのみ React に置き換える

## ディレクトリ方針

```text
frontend/
  index.html
  src/
    main.jsx
    App.jsx
    components/
    features/
    services/
    styles/
js/
  dist/
```

## ビルド方針

- 開発時は Vite dev server を使う
- 本番ビルドは `js/dist/` へ出力する
- PHP 側は manifest を参照してエントリアセットを読み込む

## React 化の対象機能

- カテゴリタブ表示
- 商品一覧表示
- 商品モーダル
- 注文追加
- 注文一覧表示
- 合計金額表示
- 会計確定

## API 契約

### `GET api/category/fetch.php`

- 用途: カテゴリ一覧取得
- 期待値: `categories` 配列を返す

### `GET api/product/fetch.php`

- 用途: 商品一覧取得
- 期待値: `products` 配列を返す

### `GET api/order/fetch.php?visit_id=:id`

- 用途: 現在注文の取得
- 期待値: `orders` 配列を返す

### `POST api/order/add.php`

- 用途: 注文追加
- body: JSON
- 必須項目:
  - `product_id`
  - `product_name`
  - `product_image_path`
  - `quantity`
  - `visit_id`

### `GET api/order/billed.php?visit_id=:id`

- 用途: 会計確定
- 期待値: `success` を返す

## PHP 側で必要な準備

- React マウント用の root 要素を `menu.php` に置く
- `visit_id` や席番号などの初期値を `data-*` 属性または JSON で埋め込む
- 開発時と本番時で読み込むアセットを切り替える helper を用意する

## 完了条件

- メニュー画面が React で描画される
- 既存 API でカテゴリ、商品、注文、会計が動作する
- `js/app.js` 依存が注文画面から外れる
- `npm run dev` と `npm run build` が通る
- PHP 側からビルド済みアセットを読み込める

## 非機能要件

- 文字化けした既存文言は React 化時に UTF-8 で整理する
- UI は既存の導線を維持しつつ、モーダルや注文一覧の可読性を改善する
- 大きい依存は増やしすぎない
