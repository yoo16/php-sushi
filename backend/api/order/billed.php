<?php
require_once "../../app.php";

use App\Models\Order;
use App\Models\Visit;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$visit_id = $data['visit_id'] ?? null;

if (!$visit_id) {
    http_response_code(400);
    echo json_encode(["error" => "Missing visit_id"]);
    exit;
}

$orderModel = new Order();
$total = $orderModel->total($visit_id);

$visitModel = new Visit();
$result = $visitModel->billed($visit_id, $total);

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update visit status"]);
    exit;
}

echo json_encode(["success" => true, "total" => $total]);
