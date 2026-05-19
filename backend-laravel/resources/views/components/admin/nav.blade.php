@props(['active' => null])
@php
    $items = [
        ['key' => 'dashboard', 'label' => 'Dashboard', 'href' => route('admin.dashboard')],
        ['key' => 'visit', 'label' => '訪問', 'href' => route('admin.visit.index')],
        ['key' => 'product', 'label' => '商品', 'href' => route('admin.product.index')],
        ['key' => 'category', 'label' => 'カテゴリー', 'href' => route('admin.category.index')],
        ['key' => 'seat', 'label' => '座席', 'href' => route('admin.seat.index')],
        ['key' => 'database', 'label' => 'DB初期化', 'href' => route('admin.database')],
    ];
@endphp
<nav class="nav">
    <div class="nav-inner">
        <p class="nav-title">Haru Sushi Admin</p>
        <ul class="nav-links">
            @foreach ($items as $item)
                <li>
                    <a href="{{ $item['href'] }}" class="nav-link {{ $active === $item['key'] ? 'active' : '' }}">
                        {{ $item['label'] }}
                    </a>
                </li>
            @endforeach
        </ul>
    </div>
</nav>
