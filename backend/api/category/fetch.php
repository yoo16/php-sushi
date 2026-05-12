<?php
require_once '../../app.php';

use App\Models\Category;

// Modelでカテゴリ情報を取得
$categoryModel = new Category();
$categories = $categoryModel->fetch();

// JSON形式で出力
echo json_encode([
    'status' => 'success',
    'categories' => $categories
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
