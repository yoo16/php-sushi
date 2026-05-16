@props(['active' => null])
@php
    $items = [
        ['key' => 'dashboard', 'label' => 'Dashboard', 'href' => '/admin/'],
        ['key' => 'visit', 'label' => '訪問', 'href' => '/admin/visit/'],
        ['key' => 'product', 'label' => '商品', 'href' => '/admin/product/'],
        ['key' => 'category', 'label' => 'カテゴリー', 'href' => '/admin/category/'],
        ['key' => 'seat', 'label' => '座席', 'href' => '/admin/seat/'],
        ['key' => 'database', 'label' => 'DB初期化', 'href' => '/admin/database/'],
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
