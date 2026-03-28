<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold">カテゴリ編集</h1>
            <a href="admin/category/" class="text-sm text-sky-600 hover:underline">← 一覧に戻る</a>
        </div>

        <form action="admin/category/update.php" method="POST" class="space-y-5">
            <input type="hidden" name="id" value="<?= htmlspecialchars($category['id'] ?? '') ?>">

            <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">カテゴリ名</label>
                <input type="text" name="name" id="name" required
                    value="<?= htmlspecialchars($category['name'] ?? '') ?>"
                    class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>

            <div>
                <label for="sort_order" class="block text-sm font-medium text-gray-700 mb-1">並び順</label>
                <input type="number" name="sort_order" id="sort_order" min="0"
                    value="<?= htmlspecialchars($category['sort_order'] ?? '') ?>"
                    class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>

            <div class="pt-2">
                <button type="submit"
                    class="w-full bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 font-medium">
                    更新する
                </button>
            </div>
        </form>

        <div class="mt-6 pt-5 border-t border-gray-100">
            <form action="admin/category/delete.php" method="POST">
                <input type="hidden" name="id" value="<?= htmlspecialchars($category['id'] ?? '') ?>">
                <button type="submit"
                    onclick="return confirm('本当に削除しますか？');"
                    class="w-full border border-red-400 text-red-500 px-4 py-2 rounded hover:bg-red-50 text-sm">
                    このカテゴリを削除する
                </button>
            </form>
        </div>
    </main>
</body>

</html>