<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="max-w-5xl mx-auto p-6 space-y-6">
        <h1 class="text-2xl font-bold">Dashboard</h1>

        <!-- 今月のサマリー -->
        <div class="grid grid-cols-2 gap-4">
            <div class="bg-white rounded shadow p-6">
                <p class="text-sm text-gray-500 mb-1">今月の売上</p>
                <p class="text-3xl font-bold tabular-nums">¥<?= number_format($monthly_sales) ?></p>
            </div>
            <div class="bg-white rounded shadow p-6">
                <p class="text-sm text-gray-500 mb-1">今月の訪問者数</p>
                <p class="text-3xl font-bold tabular-nums"><?= number_format($monthly_visits) ?><span class="text-lg font-normal text-gray-500 ml-1">組</span></p>
            </div>
        </div>

        <!-- 売れ筋ランキング -->
        <div class="bg-white rounded shadow p-6">
            <h2 class="text-lg font-bold mb-4">今月の売れ筋ランキング</h2>
            <?php if ($ranking): ?>
                <ol class="space-y-3">
                    <?php foreach ($ranking as $i => $item): ?>
                        <li class="flex items-center gap-4">
                            <span class="w-6 text-right text-sm font-bold <?= $i === 0 ? 'text-yellow-500' : 'text-gray-400' ?>">
                                <?= $i + 1 ?>
                            </span>
                            <div class="flex-1 flex items-center justify-between gap-2">
                                <span class="text-sm"><?= htmlspecialchars($item['name']) ?></span>
                                <span class="text-sm tabular-nums text-gray-500"><?= number_format($item['total_qty']) ?>皿</span>
                            </div>
                            <div class="w-32 bg-gray-100 rounded-full h-2">
                                <div class="bg-sky-500 h-2 rounded-full"
                                    style="width: <?= round($item['total_qty'] / $ranking[0]['total_qty'] * 100) ?>%"></div>
                            </div>
                        </li>
                    <?php endforeach; ?>
                </ol>
            <?php else: ?>
                <p class="text-gray-400 text-sm text-center py-4">今月の注文データがありません</p>
            <?php endif; ?>
        </div>
    </main>
</body>

</html>
