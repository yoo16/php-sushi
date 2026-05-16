# Backend Laravel Migration Spec

## 目的

既存のネイティブ PHP バックエンドを Laravel ベースへ置き換えやすい状態にする。最優先は、現行フロントエンドと管理画面の利用者に対して互換性を保ちながら、実装基盤を Laravel の標準構成へ寄せること。

## スコープ

- `backend/` を Laravel アプリケーションとして再構成するための設計
- 既存 JSON API の互換維持
- 既存管理画面の Laravel 化
- DB スキーマを Laravel migration へ移す
- 既存モデル責務を Eloquent と Service 層へ移す
- 画像アップロードと QR コード生成の移植

## スコープ外

- フロントエンドの API 契約変更
- 注文業務フローの再設計
- 認証、権限、決済、在庫管理の新規導入
- マイクロサービス化や API サーバー分離
- 既存 ER を超える大幅な DB 再設計

## 現状のソース対応

- 管理画面入口: `backend/admin/`
- JSON API: `backend/api/`
- モデル相当: `backend/app/models/`
- コントローラ相当: `backend/app/controllers/admin/`
- ビュー: `backend/app/views/`
- DB 定義: `backend/database/schema.sql`
- API 契約: `docs/backend/API.md`

## 採用方針

- Laravel の標準ディレクトリ構成を優先する
- 既存 URL は、互換レイヤを用意して可能な限り維持する
- 移行は一括置換ではなく、API と管理画面を段階移行する
- DB スキーマは現行カラムを原則維持し、rename は避ける
- ビジネスロジックは Controller に寄せず、Model と Service に分離する
- バリデーション、例外処理、レスポンス整形は Laravel 標準に寄せる
- AI が実装する際は「互換維持」と「Laravel 標準準拠」が衝突した場合、互換維持を優先する

## 目標ディレクトリ方針

```text
backend/
  app/
    Http/
      Controllers/
        Admin/
        Api/
    Models/
    Services/
  bootstrap/
  config/
  database/
    migrations/
    seeders/
  public/
    index.php
    images/
  resources/
    views/
      admin/
      components/
      home/
  routes/
    web.php
    api.php
  storage/
```

## 段階移行方針

### Phase 1

- Laravel を `backend/` に導入する
- 現行 `.php` エンドポイントと同じ URL で Laravel 側へ到達できるようにする
- DB 接続、環境変数、migration、seed の基盤を作る

### Phase 2

- JSON API を Laravel Controller + FormRequest + Resource 相当の構成へ移す
- React フロントエンドが利用する API のレスポンス互換を確認する

### Phase 3

- 管理画面の一覧、作成、更新、削除を Laravel の routing / controller / blade へ移す
- 既存の `create.php`, `edit.php`, `add.php`, `update.php`, `delete.php` の責務を REST に整理する

### Phase 4

- 旧ネイティブ PHP の参照を除去する
- 互換レイヤを残す範囲と削除する範囲を整理する

## 互換条件

- フロントエンドが利用する `/api/*.php` の URL は移行直後も維持する
- レスポンス JSON のトップレベルキーは互換維持する
- 既存の `status`, `success`, `error`, `message`, `orders`, `products`, `categories`, `visit`, `seats` などのキー名は変えない
- フロント側が `POST` JSON を送る API は、Laravel 側でも `application/json` を受ける
- 管理画面は同等の導線を維持し、登録後・更新後・削除後の遷移先も原則維持する

## ルーティング方針

### JSON API

現行のパス互換を優先し、Laravel 側で以下のエイリアスを提供する。

| 現行 URL | Laravel 内部責務 |
|---------|------------------|
| `GET /api/category/fetch.php` | `Api\CategoryController@index` |
| `GET /api/category/csv.php` | `Api\CategoryExportController` |
| `GET /api/product/fetch.php` | `Api\ProductController@index` |
| `GET /api/product/csv.php` | `Api\ProductExportController` |
| `GET /api/seat/fetch.php` | `Api\SeatController@index` |
| `GET /api/seat/available.php` | `Api\SeatController@available` |
| `GET /api/seat/find.php?id={id}` | `Api\SeatController@show` |
| `GET /api/visit/find.php?id={id}` | `Api\VisitController@show` |
| `POST /api/visit/join.php` | `Api\VisitController@join` |
| `GET /api/order/fetch.php?visit_id={id}` | `Api\OrderController@index` |
| `POST /api/order/add.php` | `Api\OrderController@store` |
| `POST /api/order/billed.php` | `Api\OrderController@bill` |

### 管理画面

公開 URL は原則維持しつつ、内部実装は Laravel の `web.php` へ寄せる。

| 現行 URL | Laravel 内部責務 |
|---------|------------------|
| `GET /admin/` | `Admin\DashboardController@index` |
| `GET /admin/category/` | `Admin\CategoryController@index` |
| `GET /admin/category/create.php` | `Admin\CategoryController@create` |
| `POST /admin/category/add.php` | `Admin\CategoryController@store` |
| `GET /admin/category/edit.php?id={id}` | `Admin\CategoryController@edit` |
| `POST /admin/category/update.php` | `Admin\CategoryController@update` |
| `POST /admin/category/delete.php` | `Admin\CategoryController@destroy` |
| `GET /admin/product/` | `Admin\ProductController@index` |
| `GET /admin/product/create.php` | `Admin\ProductController@create` |
| `POST /admin/product/add.php` | `Admin\ProductController@store` |
| `GET /admin/product/edit.php?id={id}` | `Admin\ProductController@edit` |
| `POST /admin/product/update.php` | `Admin\ProductController@update` |
| `POST /admin/product/delete.php` | `Admin\ProductController@destroy` |
| `GET /admin/seat/` | `Admin\SeatController@index` |
| `GET /admin/seat/edit.php?id={id}` | `Admin\SeatController@edit` |
| `POST /admin/seat/update.php` | `Admin\SeatController@update` |
| `GET /admin/visit/` | `Admin\VisitController@index` |
| `GET /admin/visit/show.php?id={id}` | `Admin\VisitController@show` |

## データモデル方針

### Eloquent モデル

- `Category`
- `Product`
- `Seat`
- `Visit`
- `Order`

### リレーション

- `Category hasMany Product`
- `Product belongsTo Category`
- `Seat hasMany Visit`
- `Visit belongsTo Seat`
- `Visit hasMany Order`
- `Order belongsTo Visit`
- `Order belongsTo Product`

### テーブル互換条件

- テーブル名は `categories`, `products`, `seats`, `visits`, `orders` を維持する
- 主キーは `id`
- タイムスタンプ列は `created_at`, `updated_at`
- `orders.price` は注文時点の価格スナップショットとして維持する
- `visits.status` は少なくとも `seated`, `billed`, `paid` を扱えるようにする

## ドメインルール

### Category

- 一覧は現状どおり取得できること
- `sort_order` は維持する
- 作成時に `sort_order` 未指定なら末尾採番できること

### Product

- 商品はカテゴリに属する
- 商品画像は省略可能だが、既存 `image_path` 契約は維持する
- 更新時、画像未指定なら既存画像を保持する

### Seat

- 席一覧を取得できること
- 席番号 `number` は一意
- QR コード生成責務は Service へ切り出す

### Visit

- 来店開始時に同一席の未会計セッションがあれば再利用する
- 新規来店時は `status = seated`
- 会計確定時は `total` と `total_with_tax` を保存し `status = billed` にする

### Order

- 注文追加時の単価は `products.price` から採用する
- 注文取得では商品名と画像パスを join した互換レスポンスを返す
- 合計金額は `price * quantity` の合算で算出する

## バリデーション方針

- Laravel の `FormRequest` を優先して使う
- 既存 API が 400 を返している箇所は、同等以上の明確なエラーを返す
- HTML フォーム系は validation error を session flash で戻せる構成にする
- JSON API は、成功系と失敗系のレスポンスキーを endpoint ごとに既存互換で維持する

## レスポンス方針

- `docs/backend/API.md` に記載の JSON 構造を正とする
- `order/add.php` は `{"success": true, "data": ...}` 互換を維持する
- `order/billed.php` は `{"success": true, "total": number}` 互換を維持する
- `visit/find.php`, `visit/join.php` は `status` と `visit` を返す
- 既存でエラー時に `error` を返す API は、Laravel 化後も `error` キーを維持する

## View 方針

- 管理画面は Blade を使う
- 既存 view 名と導線は大きく変えない
- コンポーネント化は `resources/views/components/` に寄せる
- React フロントエンド用のエントリ画面は既存 `menu` 導線と両立させる

## ファイルアップロード方針

- 商品画像は Laravel Storage を使って保存する
- DB には公開 URL ではなく、既存互換の `image_path` を保存する
- 既存画像配置との互換が必要な間は `public/images/products/` を維持する

## QR コード方針

- 既存の `endroid/qr-code` を継続利用してよい
- QR 生成は Controller 直書きにせず Service 化する
- 生成先は互換性のある公開パスを維持する

## マイグレーション方針

- 現行 `schema.sql` と等価な migration を作る
- 初回移行ではカラム追加や削除をしない
- seed は `insert_data.sql` の内容を Laravel seeder に置き換える

## テスト方針

- API は Feature Test を作る
- モデルルールと集計は Unit Test または Feature Test で担保する
- 少なくとも以下を自動テストする
  - カテゴリ一覧取得
  - 商品一覧取得とカテゴリ絞り込み
  - 来店開始時の再利用判定
  - 注文追加時の単価固定
  - 会計時の合計と税込計算
  - 管理画面の主要 CRUD 遷移

## 完了条件

- `backend/` が Laravel アプリとして起動する
- React フロントエンドが既存 API パスで動作する
- 管理画面の主要導線が Laravel 実装へ置き換わる
- `schema.sql` 相当の migration と seeder が存在する
- 旧ネイティブ PHP 依存なしで主要機能が動く
- テストで主要業務フローが確認できる

## 非機能要件

- UTF-8 を前提に文字化けを持ち込まない
- 例外は画面や API にそのまま露出させない
- 設定値は `.env` へ寄せる
- Controller は薄く保つ
- AI が一度に大規模変更しすぎないよう、Phase 単位で PR を分けられる構成にする
