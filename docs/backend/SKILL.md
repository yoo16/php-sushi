# Backend Laravel Migration Skill

このファイルは、Codex がこのプロジェクトで Laravel バックエンド移行を実装するときの作業ルールを定義する。

## ミッション

既存のネイティブ PHP バックエンドを Laravel へ段階移行する。目的はフルリライトではなく、現行の API と管理画面の挙動を保ちながら、保守しやすい Laravel 構成へ移すこと。

## 最初に確認すること

1. `docs/backend/SPEC.md` を読む
2. `docs/backend/API.md` を読み、互換が必要な入出力を確認する
3. `docs/backend/er.md` と `backend/database/schema.sql` を読み、テーブル構造を確認する
4. `backend/app/models/` と `backend/api/` を読み、現行ロジックを洗い出す
5. `frontend/src/services/` を読み、フロントエンドが依存している API パスとレスポンスキーを確認する

## 実装ルール

- Laravel 標準構成を優先する
- 既存 URL とレスポンス契約は、仕様変更を明示しない限り維持する
- Controller は薄くし、ドメインロジックは Service または Model に寄せる
- `.php` 付き旧 URL は互換ルートとして扱う
- DB カラム名は初回移行で変えない
- API 仕様を変える場合は、先に `SPEC.md` と `API.md` を更新する
- 画像保存、CSV 出力、QR 生成は責務を分離して実装する

## 推奨実装順

1. Laravel 基盤を `backend/` に導入する
2. DB 接続、migration、seeder を整える
3. Eloquent model と relation を作る
4. API 互換ルートを用意する
5. 注文導線で使う API を優先移行する
6. 管理画面の CRUD を順に移行する
7. 画像アップロード、CSV、QR 生成を移行する
8. テストを整備し、旧コードの依存を外す

## 触る可能性が高いファイル

- `backend/composer.json`
- `backend/database/schema.sql`
- `backend/database/insert_data.sql`
- `backend/api/**/*.php`
- `backend/app/models/*.php`
- `backend/app/controllers/admin/*.php`
- `docs/backend/SPEC.md`
- `docs/backend/API.md`

## 変更時の判断基準

- 互換性を壊していないか
- Laravel へ寄せる意味がある変更か
- 一回の変更量が大きすぎないか
- フロントエンド依存の API 契約を説明できるか
- 運用時に設定や保存先が不透明になっていないか

## 避けること

- API パスを一気に REST 風へ変えてフロントも同時に壊すこと
- Model, Service, Controller の責務を混ぜること
- migration 前提を飛ばして SQL 直書きへ戻ること
- 旧コードを理解せずに Laravel 流へ置換すること
- エラー構造を endpoint ごとに勝手に変えること

## 完了時チェック

- `SPEC.md` の完了条件を満たしている
- React フロントエンドが既存 API パスで動く
- 管理画面の主要 CRUD が Laravel で動く
- migration と seeder が再現可能
- テストで主要フローが確認できる
