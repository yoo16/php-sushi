# Frontend Tasks

## Phase 1: Setup

- [x] `frontend/` を作成する
- [x] `Vite + React` をセットアップする
- [x] `npm scripts` を定義する
- [x] `js/dist/` への build 出力を設定する

## Phase 2: PHP Bridge

- [x] `menu.php` に React mount 用の要素を追加する
- [x] `visit_id` と席情報の受け渡し方法を決める
- [x] 開発時と本番時のアセット読込方針を実装する

## Phase 3: React UI

- [x] カテゴリタブを実装する
- [x] 商品一覧を実装する
- [x] 注文モーダルを実装する
- [x] 注文一覧と合計表示を実装する
- [x] 会計確定フローを実装する

## Phase 4: Cleanup

- [x] `js/app.js` の置き換え範囲を整理する
- [x] 文字化けしている表示文言を整理する
- [x] 使わなくなったフロントコードを削除または退避する

## Phase 5: Verification

- [ ] `npm run dev` で画面確認する
- [ ] `npm run build` が成功する
- [ ] PHP から build 済みアセットを読み込める
- [ ] 注文から会計完了まで通し確認する
