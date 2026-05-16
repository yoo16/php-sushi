<x-layouts.admin title="カテゴリ編集" active="category">
    <div class="header">
        <div>
            <h1 class="heading">カテゴリ編集</h1>
            <p class="subtle">カテゴリ名と表示順を更新します。</p>
        </div>
        <a href="/admin/category/" class="button button-secondary">一覧に戻る</a>
    </div>

    @if ($errors->any())
        <div class="flash-errors">
            入力内容を確認してください。
        </div>
    @endif

    <form action="/admin/category/update.php" method="POST" class="stack">
        @csrf
        <input type="hidden" name="id" value="{{ old('id', $category->id) }}">

        <div>
            <label for="name">カテゴリ名</label>
            <input
                id="name"
                type="text"
                name="name"
                value="{{ old('name', $category->name) }}"
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
                value="{{ old('sort_order', $category->sort_order) }}"
                required
            >
            @error('sort_order')
                <p class="field-error">{{ $message }}</p>
            @enderror
        </div>

        <div class="actions">
            <button type="submit" class="button button-primary">更新する</button>
        </div>
    </form>

    <div class="section-line">
        <form action="/admin/category/delete.php" method="POST" onsubmit="return confirm('本当に削除しますか？');">
            @csrf
            <input type="hidden" name="id" value="{{ $category->id }}">
            <button type="submit" class="button button-danger">このカテゴリを削除する</button>
        </form>
    </div>
</x-layouts.admin>
