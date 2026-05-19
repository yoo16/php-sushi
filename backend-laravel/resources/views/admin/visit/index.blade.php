<x-layouts.admin title="訪問一覧" active="visit">
    <div class="header">
        <div>
            <h1 class="heading">訪問一覧</h1>
            <p class="subtle">着席中と会計済みの訪問履歴を確認できます。</p>
        </div>
    </div>

    <section>
        <h2 style="margin: 0 0 14px; font-size: 20px;">現在の訪問</h2>
        @if ($visits->isNotEmpty())
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>席番号</th>
                            <th>ステータス</th>
                            <th class="num">合計（税込）</th>
                            <th>更新日</th>
                            <th style="width: 120px;">詳細</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($visits as $visit)
                            <tr>
                                <td>{{ $visit->seat_id }}</td>
                                <td>{{ $visit->status_label }}</td>
                                <td class="num">{{ number_format($visit->total_with_tax ?? 0) }}円</td>
                                <td>{{ $visit->updated_at }}</td>
                                <td>
                                    <a href="{{ route('admin.visit.show', $visit) }}" style="color: var(--brand); font-weight: 600;">
                                        詳細
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="empty">訪問履歴はありません。</div>
        @endif
    </section>

    <section class="section-line">
        <h2 style="margin: 0 0 14px; font-size: 20px;">会計履歴</h2>
        @if ($checkoutHistory->isNotEmpty())
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>席番号</th>
                            <th>ステータス</th>
                            <th class="num">会計金額（税込）</th>
                            <th>会計日時</th>
                            <th style="width: 120px;">詳細</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($checkoutHistory as $history)
                            <tr>
                                <td>{{ $history->seat_id }}</td>
                                <td>{{ $history->status_label }}</td>
                                <td class="num">{{ number_format($history->total_with_tax ?? 0) }}円</td>
                                <td>{{ $history->updated_at }}</td>
                                <td>
                                    <a href="{{ route('admin.visit.show', $history) }}" style="color: var(--brand); font-weight: 600;">
                                        詳細
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="empty">会計履歴はありません。</div>
        @endif
    </section>
</x-layouts.admin>
