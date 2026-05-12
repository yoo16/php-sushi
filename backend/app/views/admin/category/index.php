<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold">カテゴリ一覧</h1>
            <a href="admin/category/create.php" class="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 text-sm">
                + カテゴリ追加
            </a>
        </div>

        <?php if ($categories): ?>
            <table class="min-w-full text-sm text-left border-collapse">
                <thead>
                    <tr class="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                        <th class="border-b border-gray-200 px-4 py-3 w-20">操作</th>
                        <th class="border-b border-gray-200 px-4 py-3">カテゴリ名</th>
                        <th class="border-b border-gray-200 px-4 py-3 w-24 text-right">並び順</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <?php foreach ($categories as $category): ?>
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3">
                                <a href="admin/category/edit.php?id=<?= $category['id'] ?>" class="text-sky-600 hover:underline font-medium">編集</a>
                            </td>
                            <td class="px-4 py-3"><?= htmlspecialchars($category['name']) ?></td>
                            <td class="px-4 py-3 text-right tabular-nums text-gray-500"><?= $category['sort_order'] ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p class="text-gray-400 text-center py-10">カテゴリがありません</p>
        <?php endif; ?>
    </main>
</body>

</html>