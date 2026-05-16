<!DOCTYPE html>
<html lang="ja">

<?php include VIEW_DIR . 'components/head.php' ?>

<body class="bg-gray-50">
    <?php include VIEW_DIR . 'components/admin_nav.php' ?>

    <main class="mx-auto max-w-5xl p-6 space-y-2">
        <div class="flex items-center justify-between gap-2">
            <h1 class="text-2xl font-bold">訪問詳細</h1>
            <a href="admin/visit/" class="text-sm text-blue-600 hover:underline">訪問一覧へ戻る</a>
        </div>

        <?php if (empty($visit)): ?>
            <section class="rounded border border-rose-200 bg-rose-50 p-4 text-rose-800">
                <p>指定された訪問データが存在しません</p>
            </section>
        <?php else: ?>
            <section class="grid gap-2 md:grid-cols-4">
                <div class="rounded bg-white p-4 shadow">
                    <p class="text-sm text-gray-500">席番号</p>
                    <p class="mt-2 font-bold"><?= htmlspecialchars($visit['seat_id']) ?></p>
                </div>
                <div class="rounded bg-white p-4 shadow">
                    <p class="text-sm text-gray-500">状態</p>
                    <p class="mt-2 font-bold"><?= htmlspecialchars($visit['status_label']) ?></p>
                </div>
                <div class="rounded bg-white p-4 shadow">
                    <p class="text-sm text-gray-500">小計</p>
                    <p class="mt-2 font-bold"><?= number_format($visit['subtotal']) ?>円</p>
                </div>
                <div class="rounded bg-white p-4 shadow">
                    <p class="text-sm text-gray-500">会計金額(税込)</p>
                    <p class="mt-2 font-bold"><?= number_format($visit['total_with_tax'] ?? 0) ?>円</p>
                </div>
            </section>

            <section class="rounded bg-white p-6 shadow">
                <dl class="grid gap-2 grid-cols-4">
                    <div>
                        <dt class="text-sm text-gray-500">来店ID</dt>
                        <dd class="mt-1 font-medium"><?= htmlspecialchars($visit['id']) ?></dd>
                    </div>
                    <div>
                        <dt class="text-sm text-gray-500">開始日時</dt>
                        <dd class="mt-1 font-medium"><?= htmlspecialchars($visit['created_at']) ?></dd>
                    </div>
                    <div>
                        <dt class="text-sm text-gray-500">更新日時</dt>
                        <dd class="mt-1 font-medium"><?= htmlspecialchars($visit['updated_at']) ?></dd>
                    </div>
                    <div>
                        <dt class="text-sm text-gray-500">税抜合計</dt>
                        <dd class="mt-1 font-medium"><?= number_format($visit['total'] ?? 0) ?>円</dd>
                    </div>
                </dl>
            </section>

            <section class="rounded bg-white p-6 shadow">
                <h2 class="mb-4 text-xl font-bold">注文履歴</h2>

                <?php if (empty($orders)): ?>
                    <p class="text-gray-500">この訪問に紐づく注文はありません。</p>
                <?php else: ?>
                    <table class="w-full border-collapse">
                        <thead>
                            <tr class="bg-gray-100 text-left">
                                <th class="p-3 border-b">注文日時</th>
                                <th class="p-3 border-b">商品</th>
                                <th class="p-3 border-b text-right">単価</th>
                                <th class="p-3 border-b text-right">数量</th>
                                <th class="p-3 border-b text-right">小計</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($orders as $order): ?>
                                <tr class="hover:bg-gray-50">
                                    <td class="p-3 border-b text-sm"><?= htmlspecialchars($order['created_at']) ?></td>
                                    <td class="p-3 border-b"><?= htmlspecialchars($order['product_name']) ?></td>
                                    <td class="p-3 border-b text-right"><?= number_format($order['price']) ?>円</td>
                                    <td class="p-3 border-b text-right"><?= number_format($order['quantity']) ?></td>
                                    <td class="p-3 border-b text-right"><?= number_format((int) $order['price'] * (int) $order['quantity']) ?>円</td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </section>
        <?php endif; ?>
    </main>

</body>

</html>