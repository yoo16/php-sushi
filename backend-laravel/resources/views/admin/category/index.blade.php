<x-layouts.admin title="カテゴリ一覧" active="category">
    <div class="header">
        <div>
            <h1 class="heading">カテゴリ一覧</h1>
            <p class="subtle">Laravel 管理画面のカテゴリ管理です。</p>
        </div>
        <a href="/admin/category/create.php" class="button button-primary">+ カテゴリ追加</a>
    </div>

    @if ($categories->isNotEmpty())
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th style="width: 120px;">操作</th>
                        <th>カテゴリ名</th>
                        <th class="num" style="width: 140px;">並び順</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($categories as $category)
                        <tr>
                            <td>
                                <a href="/admin/category/edit.php?id={{ $category->id }}" style="color: var(--brand); font-weight: 600;">
                                    編集
                                </a>
                            </td>
                            <td>{{ $category->name }}</td>
                            <td class="num">{{ $category->sort_order }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @else
        <div class="empty">カテゴリがありません</div>
    @endif
</x-layouts.admin>
