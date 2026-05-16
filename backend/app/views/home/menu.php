<!DOCTYPE html>
<html lang="ja">

<?php
$pageTitle = 'はる寿司 | ご注文';
$includeTailwindCdn = false;
$menuAppConfig = [
    'baseUrl' => BASE_URL,
    'apiBaseUrl' => API_BASE_URL,
    'seatId' => $seat['id'] ?? null,
    'seatNumber' => $seat['number'] ?? null,
    'visitId' => $visit['id'] ?? null,
    'visitStatus' => $visit['status'] ?? null,
];
?>
<?php include VIEW_DIR . 'components/head.php' ?>

<body>
    <?php if ($errorMessage): ?>
        <main class="menu-error-shell">
            <section class="menu-error-card">
                <p class="menu-error-kicker">Order Access Error</p>
                <h1>注文画面を開けませんでした</h1>
                <p><?= htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8') ?></p>
            </section>
        </main>
    <?php else: ?>
        <div
            id="menu-app"
            data-config="<?= htmlspecialchars(json_encode($menuAppConfig, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), ENT_QUOTES, 'UTF-8') ?>"
        ></div>
    <?php endif; ?>

    <?= viteTags('index.html') ?>
</body>

</html>
