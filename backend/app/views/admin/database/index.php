<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="mx-auto max-w-6xl p-6 space-y-6">
        <header class="space-y-2">
            <h1 class="text-2xl font-bold">データベース初期化</h1>
            <p class="text-sm text-gray-600">
                `database/` 配下の SQL を使って、スキーマ作成と初期データ投入を行います。
            </p>
        </header>

        <?php if ($status === 'success'): ?>
            <section class="rounded border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <h2 class="mb-2 font-bold">実行完了</h2>
                <p class="whitespace-pre-line text-sm"><?= htmlspecialchars($message, ENT_QUOTES, 'UTF-8') ?></p>
            </section>
        <?php elseif ($status === 'error'): ?>
            <section class="rounded border border-rose-200 bg-rose-50 p-4 text-rose-800">
                <h2 class="mb-2 font-bold">実行失敗</h2>
                <p class="whitespace-pre-line text-sm"><?= htmlspecialchars($message, ENT_QUOTES, 'UTF-8') ?></p>
            </section>
        <?php endif; ?>

        <section class="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            この操作は <strong><?= htmlspecialchars(DB_DATABASE, ENT_QUOTES, 'UTF-8') ?></strong> を初期化します。
            既存データを上書きするので、必要なデータがある場合は先に退避してください。
        </section>

        <form method="post" class="rounded bg-white p-6 shadow space-y-4">
            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8') ?>">

            <div class="flex items-center justify-between gap-4 border-b pb-4">
                <div>
                    <h2 class="font-bold">初期化を実行</h2>
                    <p class="text-sm text-gray-600">スキーマ作成 → データ初期化 → サンプルデータ投入の順で実行します。</p>
                </div>
                <button type="submit" class="rounded bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700">
                    実行する
                </button>
            </div>

            <div class="grid gap-6 lg:grid-cols-3">
                <section class="overflow-hidden rounded border border-slate-200">
                    <header class="border-b bg-slate-100 px-4 py-2 text-sm font-bold">schema.sql</header>
                    <pre class="max-h-80 overflow-auto bg-slate-950 p-4 text-xs text-sky-200"><code><?= htmlspecialchars($schemaSql, ENT_QUOTES, 'UTF-8') ?></code></pre>
                </section>
                <section class="overflow-hidden rounded border border-slate-200">
                    <header class="border-b bg-slate-100 px-4 py-2 text-sm font-bold">truncate.sql</header>
                    <pre class="max-h-80 overflow-auto bg-slate-950 p-4 text-xs text-amber-200"><code><?= htmlspecialchars($truncateSql, ENT_QUOTES, 'UTF-8') ?></code></pre>
                </section>
                <section class="overflow-hidden rounded border border-slate-200">
                    <header class="border-b bg-slate-100 px-4 py-2 text-sm font-bold">insert_data.sql</header>
                    <pre class="max-h-80 overflow-auto bg-slate-950 p-4 text-xs text-emerald-200"><code><?= htmlspecialchars($insertSql, ENT_QUOTES, 'UTF-8') ?></code></pre>
                </section>
            </div>
        </form>
    </main>
</body>

</html>
