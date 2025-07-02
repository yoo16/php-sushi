<?php

namespace App\Models;

use PDO;
use PDOException;
use Database;

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Label\LabelAlignment;
use Endroid\QrCode\Label\Font\OpenSans;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;

class Seat
{
    public $pdo;
    /**
     * コンストラクタ
     *
     * インスタンス生成時にプロパティ等の初期化が必要であれば行います。
     */
    public function __construct()
    {
        $this->pdo = Database::getInstance();
    }
    /**
     * データ取得
     *
     * @return array|null 座席データの連想配列、もしくは該当する座席がなければ null
     */
    public function fetch()
    {
        try {
            $sql = "SELECT * FROM seats ORDER BY id ASC;";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $seats = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $seats;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            echo ($e->getMessage());
            return null;
        }
    }

    /**
     * 座席IDで検索して取得
     *
     * @param int $seat_id 座席ID
     * @return array|null 
     */
    public function find($seat_id)
    {
        try {
            $sql = "SELECT * FROM seats WHERE id = :seat_id;";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['seat_id' => $seat_id]);
            $seat = $stmt->fetch(PDO::FETCH_ASSOC);
            return $seat;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            echo ($e->getMessage());
            return null;
        }
    }
    /**
     * 座席の状態を更新
     *
     * @param int $seat_id 座席ID
     * @param string $status 状態（例: 'available', 'reserved', 'occupied'）
     * @return bool 成功した場合は true、失敗した場合は false
     */
    public function updateStatus($seat_id, $status)
    {
        try {
            $sql = "UPDATE seats SET status = :status WHERE id = :seat_id;";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                'status' => $status,
                'seat_id' => $seat_id
            ]);
            return true;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            echo ($e->getMessage());
            return false;
        }
    }
    /**
     * 座席の状態を取得
     *
     * @param int $seat_id 座席ID
     * @return string|null 状態（例: 'available', 'reserved', 'occupied'）もしくは null
     */
    public function getStatus($seat_id)
    {
        try {
            $sql = "SELECT status FROM seats WHERE id = :seat_id;";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['seat_id' => $seat_id]);
            $status = $stmt->fetchColumn();
            return $status;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            echo ($e->getMessage());
            return null;
        }
    }

    /**
     * 座席の状態を reserved にリセット
     *
     * @return bool 成功した場合は true、失敗した場合は false
     */
    public function reserved($id)
    {
        try {
            $sql = "UPDATE seats SET status = 'reserved' WHERE id = :id;";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['id' => $id]);
            return true;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            echo ($e->getMessage());
            return false;
        }
    }

    /**
     * 座席の状態を vacant にリセット
     *
     * @return bool 成功した場合は true、失敗した場合は false
     */
    public function resetStatuses()
    {
        try {
            $sql = "UPDATE seats SET status = 'vacant';";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return true;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            echo ($e->getMessage());
            return false;
        }
    }

    public function generateQRCode($id)
    {
        $seat = $this->find($id);
        if (!$seat) return;

        $url = CLIENT_BASE_URL . "menu?seat={$seat['id']}";
        $builder = new Builder(
            writer: new PngWriter(),
            writerOptions: [],
            validateResult: false,
            data: $url,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 300,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin,
            logoResizeToWidth: 50,
            logoPunchoutBackground: true,
            labelFont: new OpenSans(20),
            labelAlignment: LabelAlignment::Center
        );

        $result = $builder->build();

        if (!is_dir(QR_SEAT_DIR)) {
            mkdir(QR_SEAT_DIR, 0777, true); // 再帰的に作成
        }
        $fileName = $seat['id'] . '.png';
        $path = QR_SEAT_DIR . $fileName;
        echo $result->saveToFile($path);
    }
}
