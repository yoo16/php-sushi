<x-layouts.admin title="商品一覧" active="product">
    <div class="header">
        <div>
            <h1 class="heading">商品一覧</h1>
            <p class="subtle">カテゴリ別の絞り込みと商品編集ができます。</p>
        </div>
        <a href="{{ route('admin.product.create') }}" class="button button-primary">+ 商品追加</a>
    </div>

    <div class="chips">
        <a href="{{ route('admin.product.index') }}" class="chip {{ $selectedCategoryId === null ? 'active' : '' }}">すべて</a>
        @foreach ($categories as $category)
            <a
                href="{{ route('admin.product.index', ['category_id' => $category->id]) }}"
                class="chip {{ $selectedCategoryId === $category->id ? 'active' : '' }}"
            >
                {{ $category->name }}
            </a>
        @endforeach
    </div>

    @if ($products->isNotEmpty())
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th style="width: 120px;">操作</th>
                        <th>商品名</th>
                        <th class="num" style="width: 140px;">価格</th>
                        <th style="width: 180px;">カテゴリ</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($products as $product)
                        <tr>
                            <td>
                                <a href="{{ route('admin.product.edit', $product) }}" style="color: var(--brand); font-weight: 600;">
                                    編集
                                </a>
                            </td>
                            <td>
                                <div class="product-cell">
                                    @if ($product->image_path !== '')
                                        <img src="/{{ ltrim($product->image_path, '/') }}" alt="{{ $product->name }}" class="product-thumb">
                                    @else
                                        <div class="product-thumb"></div>
                                    @endif
                                    <span>{{ $product->name }}</span>
                                </div>
                            </td>
                            <td class="num">{{ number_format($product->price) }}円</td>
                            <td>{{ $product->category?->name }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @else
        <div class="empty">商品がありません</div>
    @endif
</x-layouts.admin>
