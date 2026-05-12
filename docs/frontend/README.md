# Frontend Docs

このディレクトリは、`Vite + React` フロントエンドをこの PHP プロジェクトへ段階的に導入するための作業指示をまとめる。

## 読む順番

1. `SPEC.md`
2. `SKILL.md`
3. `TASKS.md`

## 目的

- Codex が実装時に迷わない前提を固定する
- PHP 側の既存構成を壊さずに React を導入する
- API 接続、ビルド配置、完了条件を先に明文化する

## 想定する構成

- `frontend/`: Vite + React のソース
- `js/dist/`: 本番ビルド成果物
- PHP テンプレート: Vite ビルド済みアセットを読み込む

## このプロジェクトの現状

- 画面は PHP テンプレートで構成されている
- メニュー画面の動的処理は `js/app.js` に集約されている
- API は既に存在する
  - `api/category/fetch.php`
  - `api/product/fetch.php`
  - `api/order/fetch.php`
  - `api/order/add.php`
  - `api/order/billed.php`

## ドキュメントの使い方

- 要件を変えるときは先に `SPEC.md` を更新する
- Codex に実装させる前に `SKILL.md` をコンテキストとして渡す
- 作業の進捗管理は `TASKS.md` を更新する
