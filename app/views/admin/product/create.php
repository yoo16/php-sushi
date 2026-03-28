<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold">商品登録</h1>
            <a href="admin/product/" class="text-sm text-sky-600 hover:underline">← 一覧に戻る</a>
        </div>

        <form action="admin/product/add.php" method="POST" enctype="multipart/form-data" class="space-y-5">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">商品名</label>
                <input type="text" name="name" id="name" required
                    class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>

            <div>
                <label for="category_id" class="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                <select name="category_id" id="category_id" required
                    class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400">
                    <option value="">選択してください</option>
                    <?php foreach ($categories as $cat): ?>
                        <option value="<?= htmlspecialchars($cat['id']) ?>">
                            <?= htmlspecialchars($cat['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div>
                <label for="price" class="block text-sm font-medium text-gray-700 mb-1">価格（円）</label>
                <input type="number" name="price" id="price" min="0" required
                    class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>

            <div>
                <label for="image" class="block text-sm font-medium text-gray-700 mb-1">画像ファイル</label>
                <input type="file" name="image" id="image" accept="image/*"
                    class="w-full text-sm text-gray-600 px-3 py-2" />
            </div>

            <div class="pt-2">
                <button type="submit"
                    class="w-full bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 font-medium">
                    登録する
                </button>
            </div>
        </form>
    </main>
</body>

</html>