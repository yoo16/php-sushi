<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold">商品一覧</h1>
            <a href="admin/product/create.php" class="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 text-sm">
                + 商品追加
            </a>
        </div>

        <div class="mb-5 flex flex-wrap gap-2">
            <a href="admin/product/"
                class="px-3 py-1 rounded text-sm font-medium
                <?= (!$category_id) ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200' ?>">
                すべて
            </a>
            <?php foreach ($category_names as $id => $name): ?>
                <a href="admin/product/?category_id=<?= $id ?>"
                    class="px-3 py-1 rounded text-sm font-medium
                    <?= $category_id == $id ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200' ?>">
                    <?= htmlspecialchars($name) ?>
                </a>
            <?php endforeach; ?>
        </div>

        <?php if ($products): ?>
            <table class="min-w-full text-sm text-left border-collapse">
                <thead>
                    <tr class="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                        <th class="border-b border-gray-200 px-4 py-3 w-20">操作</th>
                        <th class="border-b border-gray-200 px-4 py-3">商品名</th>
                        <th class="border-b border-gray-200 px-4 py-3 w-28 text-right">価格</th>
                        <th class="border-b border-gray-200 px-4 py-3 w-32">カテゴリ</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <?php foreach ($products as $product): ?>
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3">
                                <a href="admin/product/edit.php?id=<?= $product['id'] ?>" class="text-sky-600 hover:underline font-medium">編集</a>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <img src="<?= $product['image_path'] ?>" alt="<?= htmlspecialchars($product['name']) ?>" class="w-10 h-10 object-cover rounded">
                                    <span><?= htmlspecialchars($product['name']) ?></span>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-right tabular-nums"><?= number_format($product['price']) ?>円</td>
                            <td class="px-4 py-3 text-gray-500"><?= htmlspecialchars($category_names[$product['category_id']]) ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p class="text-gray-400 text-center py-10">商品がありません</p>
        <?php endif; ?>
    </main>
</body>

</html>