<x-layouts.admin title="訪問詳細" active="visit">
    <div class="header">
        <div>
            <h1 class="heading">訪問詳細</h1>
            <p class="subtle">訪問単位の注文履歴と会計状態を確認します。</p>
        </div>
        <a href="/admin/visit/" class="button button-secondary">訪問一覧へ戻る</a>
    </div>

    @if ($visit === null)
        <div class="flash-errors">指定された訪問データが存在しません。</div>
    @else
        <section class="cards cols-4">
            <article class="stat-card">
                <p class="stat-label">席番号</p>
                <p class="stat-value">{{ $visit->seat_id }}</p>
            </article>
            <article class="stat-card">
                <p class="stat-label">状態</p>
                <p class="stat-value">{{ $visit->status_label }}</p>
            </article>
            <article class="stat-card">
                <p class="stat-label">小計</p>
                <p class="stat-value">{{ number_format($visit->subtotal) }}円</p>
            </article>
            <article class="stat-card">
                <p class="stat-label">会計金額（税込）</p>
                <p class="stat-value">{{ number_format($visit->total_with_tax ?? 0) }}円</p>
            </article>
        </section>

        <section class="section-line">
            <dl class="detail-grid">
                <div class="detail-item">
                    <dt>来店ID</dt>
                    <dd>{{ $visit->id }}</dd>
                </div>
                <div class="detail-item">
                    <dt>開始日時</dt>
                    <dd>{{ $visit->created_at }}</dd>
                </div>
                <div class="detail-item">
                    <dt>更新日時</dt>
                    <dd>{{ $visit->updated_at }}</dd>
                </div>
                <div class="detail-item">
                    <dt>税抜合計</dt>
                    <dd>{{ number_format($visit->total ?? 0) }}円</dd>
                </div>
            </dl>
        </section>

        <section class="section-line">
            <h2 style="margin: 0 0 14px; font-size: 20px;">注文履歴</h2>
            @if ($orders->isNotEmpty())
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>注文日時</th>
                                <th>商品</th>
                                <th class="num">単価</th>
                                <th class="num">数量</th>
                                <th class="num">小計</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($orders as $order)
                                <tr>
                                    <td>{{ $order->created_at }}</td>
                                    <td>{{ $order->product_name }}</td>
                                    <td class="num">{{ number_format($order->price) }}円</td>
                                    <td class="num">{{ number_format($order->quantity) }}</td>
                                    <td class="num">{{ number_format($order->line_total) }}円</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="empty">この訪問に紐づく注文はありません。</div>
            @endif
        </section>
    @endif
</x-layouts.admin>
