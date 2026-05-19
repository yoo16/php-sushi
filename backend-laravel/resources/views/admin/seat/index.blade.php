<x-layouts.admin title="座席一覧" active="seat">
    <div class="header">
        <div>
            <h1 class="heading">座席一覧</h1>
            <p class="subtle">座席番号の確認と編集ができます。</p>
        </div>
    </div>

    @if ($seats->isNotEmpty())
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th style="width: 120px;">操作</th>
                        <th>座席番号</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($seats as $seat)
                        <tr>
                            <td>
                                <a href="{{ route('admin.seat.edit', $seat) }}" style="color: var(--brand); font-weight: 600;">
                                    編集
                                </a>
                            </td>
                            <td>{{ $seat->number }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @else
        <div class="empty">座席がありません</div>
    @endif
</x-layouts.admin>
