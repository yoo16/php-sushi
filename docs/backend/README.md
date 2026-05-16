# Backend Docs

このディレクトリは、既存のネイティブ PHP バックエンドを Laravel へ段階移行するための作業指示をまとめる。

## 読む順番

1. `SPEC.md`
2. `SKILL.md`
3. `TASKS.md`
4. `API.md`
5. `er.md`

## 目的

- Codex が Laravel 移行時に迷わない前提を固定する
- 既存の JSON API と管理画面の挙動互換を維持する
- 先に移行単位、互換条件、完了条件を明文化する

## このプロジェクトの現状

- バックエンドは `backend/` 配下のネイティブ PHP で構成されている
- データアクセスは `backend/app/models/*.php` に集約されている
- 管理画面は `backend/admin/` と `backend/app/views/admin/` の SSR 構成
- 客席側 API は `backend/api/` 配下の `.php` エンドポイントをフロントエンドが直接利用している

## ドキュメントの使い方

- 要件や移行方針を変えるときは先に `SPEC.md` を更新する
- Codex に Laravel 実装をさせる前に `SKILL.md` をコンテキストとして渡す
- 進捗管理と着手順の調整は `TASKS.md` を更新する
- エンドポイントの入出力確認は `API.md` を正とする
