<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold">カテゴリ登録</h1>
            <a href="admin/category/" class="text-sm text-sky-600 hover:underline">← 一覧に戻る</a>
        </div>

        <form action="admin/category/add.php" method="POST" class="space-y-5">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">カテゴリ名</label>
                <input type="text" name="name" id="name" required
                    class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>

            <div>
                <label for="sort_order" class="block text-sm font-medium text-gray-700 mb-1">並び順</label>
                <input type="number" name="sort_order" id="sort_order" min="0" required
                    value="<?= htmlspecialchars($category['sort_order'] ?? 1) ?>"
                    class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400" />
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