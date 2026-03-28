<?php
namespace App\Controllers\Admin;

require_once __DIR__ . '/../../../app.php';

use PDO;

class HomeController
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = \Database::getInstance();
    }

    public function index()
    {
        // 今月の売上（支払い済みのみ）
        $stmt = $this->pdo->query("
            SELECT COALESCE(SUM(total_with_tax), 0) AS total
            FROM visits
            WHERE status = 'paid'
              AND YEAR(created_at) = YEAR(NOW())
              AND MONTH(created_at) = MONTH(NOW())
        ");
        $monthly_sales = (int)$stmt->fetchColumn();

        // 今月の訪問者数
        $stmt = $this->pdo->query("
            SELECT COUNT(*) AS cnt
            FROM visits
            WHERE YEAR(created_at) = YEAR(NOW())
              AND MONTH(created_at) = MONTH(NOW())
        ");
        $monthly_visits = (int)$stmt->fetchColumn();

        // 今月の売れ筋ランキング TOP5
        $stmt = $this->pdo->query("
            SELECT p.name, SUM(o.quantity) AS total_qty
            FROM orders o
            JOIN products p ON o.product_id = p.id
            JOIN visits v ON o.visit_id = v.id
            WHERE YEAR(v.created_at) = YEAR(NOW())
              AND MONTH(v.created_at) = MONTH(NOW())
            GROUP BY o.product_id, p.name
            ORDER BY total_qty DESC
            LIMIT 5
        ");
        $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);

        require APP_DIR . 'views/admin/home/index.php';
    }
}
