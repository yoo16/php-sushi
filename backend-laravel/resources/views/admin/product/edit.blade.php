<x-layouts.admin title="商品編集" active="product">
    <div class="header">
        <div>
            <h1 class="heading">商品編集</h1>
            <p class="subtle">価格やカテゴリを更新し、必要なら画像も差し替えます。</p>
        </div>
        <a href="{{ route('admin.product.index') }}" class="button button-secondary">一覧に戻る</a>
    </div>

    @if ($errors->any())
        <div class="flash-errors">入力内容を確認してください。</div>
    @endif

    <form action="{{ route('admin.product.update', $product) }}" method="POST" enctype="multipart/form-data" class="stack">
        @csrf

        <div>
            <label for="name">商品名</label>
            <input id="name" type="text" name="name" value="{{ old('name', $product->name) }}" required>
            @error('name')
                <p class="field-error">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="category_id">カテゴリ</label>
            <select id="category_id" name="category_id" required>
                <option value="">選択してください</option>
                @foreach ($categories as $category)
                    <option value="{{ $category->id }}" @selected((int) old('category_id', $product->category_id) === $category->id)>
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
            <input id="price" type="number" name="price" min="0" value="{{ old('price', $product->price) }}" required>
            @error('price')
                <p class="field-error">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="image">画像ファイル</label>
            @if ($product->image_path !== '')
                <div class="preview-wrap">
                    <img src="/{{ ltrim($product->image_path, '/') }}" alt="現在の画像" class="preview-image">
                </div>
            @endif
            <input id="image" type="file" name="image" accept="image/*">
            <p class="subtle">変更しない場合は空欄のままにしてください。</p>
            @error('image')
                <p class="field-error">{{ $message }}</p>
            @enderror
        </div>

        <div class="actions">
            <button type="submit" class="button button-primary">更新する</button>
        </div>
    </form>

    <div class="section-line">
        <form action="{{ route('admin.product.destroy', $product) }}" method="POST" onsubmit="return confirm('本当に削除しますか？');">
            @csrf
            <button type="submit" class="button button-danger">この商品を削除する</button>
        </form>
    </div>
</x-layouts.admin>
