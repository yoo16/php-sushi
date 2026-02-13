<?php
require_once '../../app.php';

use App\Models\Seat;
use App\Models\Visit;

$seatModel = new Seat();
$visitModel = new Visit();

$seats = $seatModel->fetch();

$available = [];
if (is_array($seats)) {
    foreach ($seats as $s) {
        $seatId = $s['id'] ?? null;
        if ($seatId === null) continue;

        $exists = $visitModel->exists($seatId);
        // Visit::exists は該当する未会計の来店セッションがあれば配列を、なければ false を返す
        if ($exists === false) {
            $available[] = $s;
        }
    }
}

echo json_encode([
    'status' => 'success',
    'available_seats' => $available
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
