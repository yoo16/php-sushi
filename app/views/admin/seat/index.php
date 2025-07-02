<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h1 class="text-2xl text-center font-bold mb-4">カテゴリ一覧</h1>

        <?php if ($seats): ?>
            <table class="min-w-full text-left table-auto border border-gray-200">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="border px-4 py-2">操作</th>
                        <th class="border px-4 py-2">座席番号</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($seats as $seat): ?>
                        <tr class="border-b hover:bg-gray-50">
                            <td class="border px-4 py-2">
                                <a href="admin/seat/edit.php?id=<?= $seat['id'] ?>" class="text-blue-600">編集</a>
                            </td>
                            <td class="border px-4 py-2"><?= $seat['number'] ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </main>
</body>

</html>