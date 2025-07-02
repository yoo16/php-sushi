<?php

namespace App\Controllers\Admin;

require_once __DIR__ . '/../../../app.php';

use App\Models\Seat;

class SeatController
{
    public function __construct() {}

    /**
     * カテゴリ一覧の表示
     */
    public function index()
    {
        // Modelでカテゴリ情報を取得
        $seatModel = new Seat();
        $seats = $seatModel->fetch();

        // Viewの表示
        require VIEW_DIR . 'admin/seat/index.php';
    }

        /**
     * カテゴリの編集画面表示
     */
    public function edit()
    {
        // GETリクエストでidを取得
        $id = $_GET['id'] ?? null;

        // Modelでカテゴリ情報を取得
        $seatModel = new Seat();
        $seat = $seatModel->find($id);

        // カテゴリが存在しない場合はトップページへリダイレクト
        if (!$seat) {
            header("Location: ./");
            exit;
        }

        // Viewの表示
        require VIEW_DIR . 'admin/seat/edit.php';
    }

}