<x-layouts.admin title="商品登録" active="product">
    <div class="header">
        <div>
            <h1 class="heading">商品登録</h1>
            <p class="subtle">商品名、カテゴリ、価格、画像を登録します。</p>
        </div>
        <a href="{{ route('admin.product.index') }}" class="button button-secondary">一覧に戻る</a>
    </div>

    @if ($errors->any())
        <div class="flash-errors">入力内容を確認してください。</div>
    @endif

    <form action="{{ route('admin.product.store') }}" method="POST" enctype="multipart/form-data" class="stack">
        @csrf
        <div>
            <label for="name">商品名</label>
            <input id="name" type="text" name="name" value="{{ old('name') }}" required>
            @error('name')
                <p class="field-error">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="category_id">カテゴリ</label>
            <select id="category_id" name="category_id" required>
                <option value="">選択してください</option>
                @foreach ($categories as $category)
                    <option value="{{ $category->id }}" @selected((int) old('category_id') === $category->id)>
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>
            @error('category_id')
                <p class="field-error">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="price">価格（円）</label>
            <input id="price" type="number" name="price" min="0" value="{{ old('price') }}" required>
            @error('price')
                <p class="field-error">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="image">画像ファイル</label>
            <input id="image" type="file" name="image" accept="image/*">
            @error('image')
                <p class="field-error">{{ $message }}</p>
            @enderror
        </div>

        <div class="actions">
            <button type="submit" class="button button-primary">登録する</button>
        </div>
    </form>
</x-layouts.admin>
