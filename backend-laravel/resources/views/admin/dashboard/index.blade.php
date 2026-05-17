<x-layouts.admin title="Dashboard" active="dashboard">
    <div class="header">
        <div>
            <h1 class="heading">Dashboard</h1>
            <p class="subtle">{{ $monthLabel }} の売上と注文傾向です。</p>
        </div>
    </div>

    <section class="cards cols-4">
        <article class="stat-card">
            <p class="stat-label">今月の売上</p>
            <p class="stat-value">¥{{ number_format($monthlySales) }}</p>
        </article>
        <article class="stat-card">
            <p class="stat-label">今月の訪問者数</p>
            <p class="stat-value">{{ number_format($monthlyVisits) }}組</p>
        </article>
        <article class="stat-card">
            <p class="stat-label">ランクイン商品数</p>
            <p class="stat-value">{{ $ranking->count() }}</p>
        </article>
        <article class="stat-card">
            <p class="stat-label">最多注文数</p>
            <p class="stat-value">{{ number_format($rankingTopQuantity) }}皿</p>
        </article>
    </section>

    <section class="section-line">
        <div class="header" style="margin-bottom: 16px;">
            <div>
                <h2 style="margin: 0; font-size: 20px;">今月の売れ筋ランキング</h2>
                <p class="subtle">注文数ベースの上位 5 商品です。</p>
            </div>
        </div>

        @if ($ranking->isNotEmpty())
            <div class="stack">
                @foreach ($ranking as $index => $item)
                    @php
                        $barWidth = $rankingTopQuantity > 0
                            ? max(8, (int) round(((int) $item->total_qty / $rankingTopQuantity) * 100))
                            : 0;
                    @endphp
                    <article style="display: grid; grid-template-columns: 40px minmax(0,1fr) 160px; align-items: center; gap: 14px;">
                        <div style="font-weight: 700; text-align: right; color: {{ $index === 0 ? '#d97706' : '#94a3b8' }};">
                            {{ $index + 1 }}
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; gap: 12px; margin-bottom: 8px;">
                                <span>{{ $item->name }}</span>
                                <span class="subtle">{{ number_format($item->total_qty) }}皿</span>
                            </div>
                            <div style="height: 10px; border-radius: 999px; background: #e2e8f0; overflow: hidden;">
                                <div style="height: 100%; width: {{ $barWidth }}%; border-radius: 999px; background: linear-gradient(90deg, #0f766e, #0284c7);"></div>
                            </div>
                        </div>
                        <div class="subtle" style="text-align: right;">{{ $index === 0 ? 'TOP ITEM' : '' }}</div>
                    </article>
                @endforeach
            </div>
        @else
            <div class="empty">今月の注文データがありません</div>
        @endif
    </section>
</x-layouts.admin>
