<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="mx-auto bg-white p-6 rounded shadow">
        <h1 class="text-2xl font-bold text-center mb-6">訪問一覧</h1>

        <?php if (empty($visits)): ?>
            <p class="text-gray-500">訪問履歴はありません。</p>
        <?php else: ?>
            <table class="w-full bg-white shadow rounded border-collapse">
                <thead>
                    <tr class="bg-gray-100 text-left">
                        <th class="p-3 border-b">席番号</th>
                        <th class="p-3 border-b">ステータス</th>
                        <th class="p-3 border-b">合計（税込）</th>
                        <th class="p-3 border-b">更新日</th>
                        <th class="p-3 border-b">詳細</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($visits as $visit): ?>
                        <tr class="hover:bg-gray-50">
                            <td class="p-3 border-b"><?= htmlspecialchars($visit['seat_id']) ?></td>
                            <td class="p-3 border-b"><?= htmlspecialchars($visit['status_label']) ?></td>
                            <td class="p-3 border-b text-right"><?= number_format($visit['total_with_tax'] ?? 0) ?>円</td>
                            <td class="p-3 border-b text-sm"><?= htmlspecialchars($visit['updated_at']) ?></td>
                            <td class="p-3 border-b">
                                <a href="admin/visit/show.php?id=<?= $visit['id'] ?>" class="text-blue-600 hover:underline">詳細</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>

        <section class="mt-10">
            <h2 class="text-xl font-bold mb-4">会計履歴</h2>

            <?php if (empty($checkoutHistory)): ?>
                <p class="text-gray-500">会計履歴はありません。</p>
            <?php else: ?>
                <table class="w-full bg-white shadow rounded border-collapse">
                    <thead>
                        <tr class="bg-gray-100 text-left">
                            <th class="p-3 border-b">席番号</th>
                            <th class="p-3 border-b">ステータス</th>
                            <th class="p-3 border-b">会計金額（税込）</th>
                            <th class="p-3 border-b">会計日時</th>
                            <th class="p-3 border-b">詳細</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (!empty($checkoutHistory)): ?>
                            <?php foreach ($checkoutHistory as $history): ?>
                                <tr class="hover:bg-gray-50">
                                    <td class="p-3 border-b"><?= htmlspecialchars($history['seat_id']) ?></td>
                                    <td class="p-3 border-b"><?= htmlspecialchars($history['status_label']) ?></td>
                                    <td class="p-3 border-b text-right"><?= number_format($history['total_with_tax'] ?? 0) ?>円</td>
                                    <td class="p-3 border-b text-sm"><?= htmlspecialchars($history['updated_at']) ?></td>
                                    <td class="p-3 border-b">
                                        <a href="admin/visit/show.php?id=<?= $history['id'] ?>" class="text-blue-600 hover:underline">詳細</a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </section>

    </main>

</body>

</html>
