<?php   
require_once '../../app.php';

use App\Models\Product;

$category_id = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;

$productModel = new Product();
$products = $category_id > 0 ?
    $productModel->fetchByCategoryId($category_id) :
    $productModel->fetch();

echo json_encode([
    'status' => 'success',
    'products' => $products,
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);