<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 class="text-2xl text-center font-bold mb-4">座席-編集</h1>

        <form action="admin/seat/update.php" method="POST" enctype="multipart/form-data" class="space-y-4">
            <input type="hidden" name="id" value="<?= $seat['id'] ?? '' ?>">
            <div>
                <label for="name" class="block text-sm font-semibold">カテゴリ名</label>
                <div class="bg-gray-100 border border-gray-300 rounded px-4 py-2">
                    <?= $seat['number'] ?>
                </div>
            </div>

            <div class="flex justify-between items-center mt-4">
                <button type="submit"
                    class="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700">
                    更新
                </button>
                <a href="admin/seat/" class="inline border border-sky-600 text-sky-600 px-4 py-2 rounded">戻る</a>
            </div>
        </form>
    </main>
</body>

</html>