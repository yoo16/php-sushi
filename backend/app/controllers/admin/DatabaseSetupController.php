<?php

namespace App\Controllers\Admin;

require_once __DIR__ . '/../../../app.php';

use Exception;
use PDO;

class DatabaseSetupController
{
    public function index()
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }

        $message = '';
        $status = null;

        $schemaSql = $this->readSqlFile(BASE_DIR . '/database/schema.sql', '-- schema.sql not found');
        $truncateSql = $this->readSqlFile(BASE_DIR . '/database/truncate.sql', '-- truncate.sql not found');
        $insertSql = $this->readSqlFile(BASE_DIR . '/database/insert_data.sql', '-- insert_data.sql not found');

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
                http_response_code(400);
                $status = 'error';
                $message = '不正なリクエストです。';
            } else {
                [$status, $message] = $this->setupDatabase($schemaSql, $truncateSql, $insertSql);
            }
        }

        require VIEW_DIR . 'admin/database/index.php';
    }

    private function setupDatabase($schemaSql, $truncateSql, $insertSql)
    {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';charset=utf8mb4';
            $pdo = new PDO($dsn, DB_USERNAME, DB_PASSWORD);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

            $pdo->exec('CREATE DATABASE IF NOT EXISTS `' . DB_DATABASE . '`');
            $pdo->exec('USE `' . DB_DATABASE . '`');
            $pdo->exec($schemaSql);

            $messages = ['スキーマを作成しました。'];

            if (trim($truncateSql) !== '' && strpos($truncateSql, 'not found') === false) {
                $pdo->exec($truncateSql);
                $messages[] = '既存データを初期化しました。';
            }

            $pdo->exec($insertSql);
            $messages[] = '初期データを投入しました。';

            return ['success', implode(PHP_EOL, $messages)];
        } catch (Exception $e) {
            return ['error', 'エラーが発生しました: ' . $e->getMessage()];
        }
    }

    private function readSqlFile($path, $fallback)
    {
        if (!is_file($path)) {
            return $fallback;
        }

        return (string) file_get_contents($path);
    }
}
