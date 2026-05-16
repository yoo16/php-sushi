<?php
require_once __DIR__ . '/../../app.php';

use App\Controllers\Admin\DatabaseSetupController;

$controller = new DatabaseSetupController();
$controller->index();
