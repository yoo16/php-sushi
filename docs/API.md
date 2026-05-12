# API仕様書

## 概要

このドキュメントはPHP寿司プロジェクトの全エンドポイントを定義します。
エンドポイントは **管理画面（Admin）** と **JSON API** の2種類に分かれます。

---

## 管理画面エンドポイント

サーバーサイドレンダリング（HTML返却）。フォーム送信はリダイレクトで応答します。

### ダッシュボード

| メソッド | URL | 説明 |
|---------|-----|------|
| GET | `admin/` | 今月の売上・訪問者数・売れ筋ランキングを表示 |

---

### カテゴリ管理

| メソッド | URL | 説明 |
|---------|-----|------|
| GET | `admin/category/` | カテゴリ一覧 |
| GET | `admin/category/create.php` | カテゴリ登録フォーム |
| POST | `admin/category/add.php` | カテゴリ登録 |
| GET | `admin/category/edit.php?id={id}` | カテゴリ編集フォーム |
| POST | `admin/category/update.php` | カテゴリ更新 |
| POST | `admin/category/delete.php` | カテゴリ削除 |

#### POST `admin/category/add.php`

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `name` | string | ✓ | カテゴリ名 |
| `sort_order` | int | | 並び順 |

**レスポンス:** 成功時 → `admin/category/` へリダイレクト
**レスポンス:** 失敗時 → `admin/category/create.php` へリダイレクト

#### POST `admin/category/update.php`

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | int | ✓ | カテゴリID |
| `name` | string | ✓ | カテゴリ名 |
| `sort_order` | int | | 並び順 |

**レスポンス:** 成功時 → `admin/category/` へリダイレクト
**レスポンス:** 失敗時 → `admin/category/edit.php?id={id}` へリダイレクト

#### POST `admin/category/delete.php`

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | int | ✓ | カテゴリID |

**レスポンス:** `admin/category/` へリダイレクト

---

### 商品管理

| メソッド | URL | 説明 |
|---------|-----|------|
| GET | `admin/product/` | 商品一覧（`?category_id={id}` でカテゴリ絞り込み） |
| GET | `admin/product/create.php` | 商品登録フォーム |
| POST | `admin/product/add.php` | 商品登録 |
| GET | `admin/product/edit.php?id={id}` | 商品編集フォーム |
| POST | `admin/product/update.php` | 商品更新 |
| POST | `admin/product/delete.php` | 商品削除 |

#### POST `admin/product/add.php`

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `name` | string | ✓ | 商品名 |
| `price` | int | ✓ | 価格（円） |
| `category_id` | int | ✓ | カテゴリID |
| `image` | file | | 商品画像（multipart/form-data） |

**レスポンス:** `admin/product/` へリダイレクト

#### POST `admin/product/update.php`

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | int | ✓ | 商品ID |
| `name` | string | ✓ | 商品名 |
| `price` | int | ✓ | 価格（円） |
| `category_id` | int | ✓ | カテゴリID |
| `image` | file | | 新しい商品画像（省略時は変更なし） |

**レスポンス:** 成功時 → `admin/product/` へリダイレクト
**レスポンス:** 失敗時 → `admin/product/edit.php?id={id}` へリダイレクト

#### POST `admin/product/delete.php`

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | int | ✓ | 商品ID |

**レスポンス:** `admin/product/` へリダイレクト

---

### 席管理

| メソッド | URL | 説明 |
|---------|-----|------|
| GET | `admin/seat/` | 席一覧 |
| GET | `admin/seat/edit.php?id={id}` | 席編集フォーム |
| POST | `admin/seat/update.php` | 席番号更新 |

#### POST `admin/seat/update.php`

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | int | ✓ | 席ID |

**レスポンス:** `admin/seat/` へリダイレクト

---

### 訪問管理

| メソッド | URL | 説明 |
|---------|-----|------|
| GET | `admin/visit/` | 訪問一覧（ステータス表示付き） |

---

## JSON API エンドポイント

客席側クライアントから利用するJSON APIです。
リクエストボディはJSON形式（`Content-Type: application/json`）。

---

### カテゴリ API

#### GET `api/category/fetch.php`

全カテゴリを取得します。

**レスポンス**

```json
{
  "status": "success",
  "categories": [
    {
      "id": 1,
      "name": "まぐろ",
      "sort_order": 1,
      "created_at": "2024-01-01 00:00:00",
      "updated_at": "2024-01-01 00:00:00"
    }
  ]
}
```

#### GET `api/category/csv.php`

全カテゴリをCSV形式でエクスポートします。

**レスポンス:** CSVストリーム（カラム: `id, name, sort_order, created_at, updated_at`）

---

### 商品 API

#### GET `api/product/fetch.php`

商品一覧を取得します。

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `category_id` | int | | カテゴリIDで絞り込み（0または省略時は全件） |

**レスポンス**

```json
{
  "status": "success",
  "products": [
    {
      "id": 1,
      "name": "まぐろ",
      "price": 120,
      "image_path": "images/products/maguro.jpg",
      "category_id": 1,
      "created_at": "2024-01-01 00:00:00",
      "updated_at": "2024-01-01 00:00:00"
    }
  ]
}
```

#### GET `api/product/csv.php`

全商品をCSV形式でエクスポートします。

**レスポンス:** CSVダウンロード（カラム: `id, name, price, image_path, category_id, created_at, updated_at`）

---

### 席 API

#### GET `api/seat/fetch.php`

全席を取得します。

**レスポンス**

```json
{
  "status": "success",
  "seats": [
    {
      "id": 1,
      "number": 1,
      "created_at": "2024-01-01 00:00:00",
      "updated_at": "2024-01-01 00:00:00"
    }
  ]
}
```

#### GET `api/seat/available.php`

利用可能な席（未会計の訪問が存在しない席）を取得します。

**レスポンス:** `api/seat/fetch.php` と同形式

#### GET `api/seat/find.php`

指定IDの席を取得します。

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | int | ✓ | 席ID |

**レスポンス（成功）**

```json
{
  "status": "success",
  "seat": {
    "id": 1,
    "number": 1,
    "created_at": "2024-01-01 00:00:00",
    "updated_at": "2024-01-01 00:00:00"
  }
}
```

**レスポンス（エラー）**

```json
{
  "status": "error",
  "message": "指定された席が見つかりません。"
}
```

---

### 訪問 API

#### GET `api/visit/find.php`

指定IDの訪問セッションを取得します。

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | int | ✓ | 訪問ID |

**レスポンス（成功）**

```json
{
  "status": "success",
  "visit": {
    "id": 1,
    "seat_id": 3,
    "status": "seated",
    "total": 0,
    "total_with_tax": 0,
    "created_at": "2024-01-01 00:00:00",
    "updated_at": "2024-01-01 00:00:00"
  }
}
```

**レスポンス（エラー）**

```json
{
  "status": "error",
  "message": "指定された来店セッションが見つかりません。"
}
```

#### POST `api/visit/join.php`

席に着席し、訪問セッションを開始します。既存の未会計セッションがある場合はそれを返します。

**リクエストボディ**

```json
{
  "seat_id": 3
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `seat_id` | int | ✓ | 席ID（1以上） |

**レスポンス（成功）**

```json
{
  "status": "success",
  "visit": {
    "id": 1,
    "seat_id": 3,
    "status": "seated",
    "total": 0,
    "total_with_tax": 0,
    "created_at": "2024-01-01 00:00:00",
    "updated_at": "2024-01-01 00:00:00"
  }
}
```

**レスポンス（エラー）**

```json
{
  "status": "error",
  "message": "無効な席IDです。"
}
```

---

### 注文 API

#### GET `api/order/fetch.php`

指定された訪問の注文一覧と合計金額を取得します。

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `visit_id` | int | ✓ | 訪問ID |

**レスポンス（成功）**

```json
{
  "status": "success",
  "orders": [
    {
      "id": 1,
      "visit_id": 1,
      "product_id": 5,
      "quantity": 2,
      "price": 120,
      "product_name": "まぐろ",
      "product_image_path": "images/products/maguro.jpg"
    }
  ],
  "total": 240
}
```

**レスポンス（エラー）** — HTTP 400

```json
{
  "error": "Missing visit_id"
}
```

#### POST `api/order/add.php`

注文を追加します。

**リクエストボディ**

```json
{
  "visit_id": 1,
  "product_id": 5,
  "quantity": 2
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `visit_id` | int | ✓ | 訪問ID |
| `product_id` | int | ✓ | 商品ID |
| `quantity` | int | ✓ | 数量 |

**レスポンス（成功）** — HTTP 200

```json
{
  "success": true,
  "data": {
    "visit_id": 1,
    "product_id": 5,
    "quantity": 2,
    "price": 120
  }
}
```

**レスポンス（バリデーションエラー）** — HTTP 400

```json
{
  "error": "Missing required fields"
}
```

**レスポンス（サーバーエラー）** — HTTP 500

```json
{
  "error": "Failed to add order"
}
```

#### GET `api/order/billed.php`

訪問を会計済みにします。合計金額を算出して `visits.total` / `visits.total_with_tax` を更新し、ステータスを `billed` に変更します。

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `visit_id` | int | ✓ | 訪問ID |

**レスポンス（成功）** — HTTP 200

```json
{
  "success": true,
  "total": 480
}
```

**レスポンス（エラー）** — HTTP 400 / 500

```json
{
  "error": "Missing visit_id"
}
```

---

## ステータス定義

### 訪問ステータス (`visits.status`)

| 値 | 説明 |
|----|------|
| `seated` | 着席中（注文受付中） |
| `billed` | 会計済み（支払い待ち） |
| `paid` | 支払い完了 |
