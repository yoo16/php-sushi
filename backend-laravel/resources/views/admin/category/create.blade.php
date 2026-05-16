<x-layouts.admin title="カテゴリ登録" active="category">
    <div class="header">
        <div>
            <h1 class="heading">カテゴリ登録</h1>
            <p class="subtle">表示順を含めて新しいカテゴリを追加します。</p>
        </div>
        <a href="/admin/category/" class="button button-secondary">一覧に戻る</a>
    </div>

    @if ($errors->any())
        <div class="flash-errors">
            入力内容を確認してください。
        </div>
    @endif

    <form action="/admin/category/add.php" method="POST" class="stack">
        @csrf
        <div>
            <label for="name">カテゴリ名</label>
            <input
                id="name"
                type="text"
                name="name"
                value="{{ old('name') }}"
                required
            >
            @error('name')
                <p class="field-error">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="sort_order">並び順</label>
            <input
                id="sort_order"
                type="number"
                name="sort_order"
                min="0"
                value="{{ old('sort_order', $nextSortOrder) }}"
                required
            >
            @error('sort_order')
                <p class="field-error">{{ $message }}</p>
            @enderror
        </div>

        <div class="actions">
            <button type="submit" class="button button-primary">登録する</button>
        </div>
    </form>
</x-layouts.admin>
