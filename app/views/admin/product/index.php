<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h1 class="text-2xl text-center font-bold mb-4">商品一覧</h1>

        <div class="mb-4 text-right">
            <a href="admin/product/create.php" class="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700">
                商品追加
            </a>
        </div>

        <div class="mb-4 flex gap-2">
            <!-- 「すべて」リンク -->
            <a href="admin/product/"
                class="px-3 py-1 rounded 
                <?= (!$category_id) ? 'bg-sky-600 text-white' : '' ?>">
                すべて
            </a>

            <!-- カテゴリごとのリンク -->
            <?php foreach ($category_names as $id => $name): ?>
                <a href="admin/product/?category_id=<?= $id ?>"
                    class="px-3 py-1 rounded 
                    <?= $category_id == $id ? 'bg-sky-600 text-white' : '' ?>">
                    <?= htmlspecialchars($name) ?>
                </a>
            <?php endforeach; ?>
        </div>

        <?php if ($products): ?>
            <table class="min-w-full text-left table-auto border border-gray-200">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="border px-4 py-2">操作</th>
                        <th class="border px-4 py-2">商品名</th>
                        <th class="border px-4 py-2">価格</th>
                        <th class="border px-4 py-2">カテゴリ</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $product): ?>
                        <tr class="hover:bg-gray-50">
                            <td class="border px-4 py-2 space-x-2">
                                <a href="admin/product/edit.php?id=<?= $product['id'] ?>" class="text-blue-600 hover:underline">編集</a>
                            </td>
                            <td class="border px-4 py-2">
                                <img src="<?= $product['image_path'] ?>" alt="<?= $product['name'] ?>" class="w-12">
                                <?= $product['name'] ?>
                            </td>
                            <td class="border px-4 py-2"><?= number_format($product['price']) ?>円</td>
                            <td class="border px-4 py-2"><?= $category_names[$product['category_id']] ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </main>
</body>

</html>