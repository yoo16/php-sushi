<?php
require_once __DIR__ . '/../../app.php';

use App\Controllers\Admin\SeatController;

$controller = new SeatController();
$controller->edit();