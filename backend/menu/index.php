<?php
require_once __DIR__ . '/../app.php';

use App\Models\Seat;
use App\Models\Visit;

$seatId = filter_input(INPUT_GET, 'seat', FILTER_VALIDATE_INT) ?: 0;
$seat = null;
$visit = null;
$errorMessage = null;

if ($seatId <= 0) {
    $errorMessage = '席情報が不足しています。QR コードから再度アクセスしてください。';
} else {
    $seatModel = new Seat();
    $visitModel = new Visit();

    $seat = $seatModel->find($seatId);
    if (!$seat) {
        $errorMessage = '指定された席が見つかりません。';
    } else {
        $existingVisit = $visitModel->exists($seatId);
        if ($existingVisit) {
            $visit = $existingVisit;
        } else {
            $visitId = $visitModel->create($seatId);
            if ($visitId) {
                $visit = $visitModel->find($visitId);
            }
        }

        if (!$visit) {
            $errorMessage = '注文セッションの開始に失敗しました。';
        }
    }
}

include VIEW_DIR . 'home/menu.php';
