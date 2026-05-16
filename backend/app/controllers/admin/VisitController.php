<?php

namespace App\Controllers\Admin;

require_once __DIR__ . '/../../../app.php';

use App\Models\Visit;
use App\Models\Order;

class VisitController
{
    /**
     * 訪問一覧を表示
     *
     * @return void
     */
    public function index()
    {
        // Modelで訪問情報を取得
        $visitModel = new Visit();
        $visits = $visitModel->fetch();
        $checkoutHistory = $visitModel->fetchCheckoutHistory();

        // ステータスのラベルマッピング
        $statusLabels = [
            'seated' => '🪑 着席',
            'billed' => '🧾 会計済',
            'paid'   => '✅ 支払い済',
        ];
        // 各 visit に status_label を付与
        foreach ($visits as &$visit) {
            $visit['status_label'] = $statusLabels[$visit['status']] ?? $visit['status'];
        }
        unset($visit);

        foreach ($checkoutHistory as &$history) {
            $history['status_label'] = $statusLabels[$history['status']] ?? $history['status'];
        }
        unset($history);

        // Viewの表示
        require VIEW_DIR . 'admin/visit/index.php';
    }

    /**
     * 訪問詳細を表示
     *
     * @param int $orderId
     * @return void
     */
    public function show()
    {
        $visitId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT) ?: 0;
        $visitModel = new Visit();
        $orderModel = new Order();
        $visit = $visitModel->find($visitId);

        if (!$visit) {
            http_response_code(404);
            $errorMessage = '指定された訪問履歴が見つかりません。';
            require VIEW_DIR . 'admin/visit/show.php';
            return;
        }

        $orders = $orderModel->fetchByVisitId($visitId) ?? [];
        $statusLabels = [
            'seated' => '🪑 着席',
            'billed' => '🧾 会計済',
            'paid'   => '✅ 支払い済',
        ];
        $visit['status_label'] = $statusLabels[$visit['status']] ?? $visit['status'];
        $visit['subtotal'] = array_reduce($orders, function ($sum, $order) {
            return $sum + ((int) $order['price'] * (int) $order['quantity']);
        }, 0);

        require VIEW_DIR . 'admin/visit/show.php';
    }
}
