<?php
// セッション開始
session_start();
// session_regenerate_id(true);

// 設定ファイルを読み込み
require_once "env.php";

// ライブラリ読み込み
// require 'vendor/autoload.php';

const TAX_RATE = 0.1; // 消費税率

// アプリケーションのルートディレクトリパス
const BASE_DIR = __DIR__;
// app/ ディレクトリパス
const APP_DIR = __DIR__ . "/app/";
// views/ ディレクトリパス
const VIEW_DIR = APP_DIR . "/views/";
// lib/ ディレクトリパス
const LIB_DIR = __DIR__ . "/lib/";
// components/ ディレクトリパス
const COMPONENT_DIR = __DIR__ . "/components/";

// upload image base path
const IMAGE_BASE = "images/";
// upload image dir
const PRODUCTS_IMAGE_DIR = IMAGE_BASE . "products/";
// QRコードの保存ディレクトリ
const QR_DIR = __DIR__ . "/qr/";
const QR_SEAT_DIR = QR_DIR . "seat/";

// ライブラリ読み込み
require_once LIB_DIR . 'Database.php';
require_once LIB_DIR . 'Sanitize.php';
require_once LIB_DIR . 'File.php';
require_once LIB_DIR . 'Vite.php';

// モデルクラスの読み込み
require_once APP_DIR . 'models/Product.php';
require_once APP_DIR . 'models/Category.php';
require_once APP_DIR . 'models/Seat.php';
require_once APP_DIR . 'models/Visit.php';
require_once APP_DIR . 'models/Order.php';

// コントローラークラスの読み込み
require_once APP_DIR . 'controllers/admin/HomeController.php';
require_once APP_DIR . 'controllers/admin/CategoryController.php';
require_once APP_DIR . 'controllers/admin/ProductController.php';
require_once APP_DIR . 'controllers/admin/VisitController.php';
require_once APP_DIR . 'controllers/admin/SeatController.php';

if (!defined('BASE_URL')) define('BASE_URL', getBaseUrl());

function getBaseUrl()
{
    $backendDir = str_replace('\\', '/', realpath(__DIR__) ?: __DIR__);
    $scriptFile = str_replace('\\', '/', realpath($_SERVER['SCRIPT_FILENAME'] ?? '') ?: ($_SERVER['SCRIPT_FILENAME'] ?? ''));
    $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');

    if ($scriptFile !== '' && $scriptName !== '' && strpos($scriptFile, $backendDir) === 0) {
        $relativePath = ltrim(substr($scriptFile, strlen($backendDir)), '/');

        if ($relativePath !== '' && substr($scriptName, -strlen($relativePath)) === $relativePath) {
            $basePath = substr($scriptName, 0, -strlen($relativePath));
            return rtrim($basePath, '/') . '/';
        }
    }

    $documentRoot = str_replace('\\', '/', realpath($_SERVER['DOCUMENT_ROOT'] ?? '') ?: ($_SERVER['DOCUMENT_ROOT'] ?? ''));
    $directory = str_replace('\\', '/', __DIR__);

    if ($documentRoot !== '' && strpos($directory, $documentRoot) === 0) {
        $basePath = substr($directory, strlen($documentRoot));
        return rtrim($basePath, '/') . '/';
    }

    return '/backend/';
}
