<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold">座席編集</h1>
            <a href="admin/seat/" class="text-sm text-sky-600 hover:underline">← 一覧に戻る</a>
        </div>

        <form action="admin/seat/update.php" method="POST" class="space-y-5">
            <input type="hidden" name="id" value="<?= htmlspecialchars($seat['id'] ?? '') ?>">

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">座席番号</label>
                <div class="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-700">
                    <?= htmlspecialchars($seat['number']) ?>
                </div>
            </div>

            <div class="pt-2">
                <button type="submit"
                    class="w-full bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 font-medium">
                    更新する
                </button>
            </div>
        </form>
    </main>
</body>

</html>