<x-layouts.admin title="データベース初期化" active="database">
    <div class="header">
        <div>
            <h1 class="heading">データベース初期化</h1>
            <p class="subtle">Laravel の migration / seeder を使って DB を初期化します。</p>
        </div>
    </div>

    @if ($status === 'success')
        <section class="flash-success">
            <h2 class="flash-title">実行完了</h2>
            <p class="flash-body">{{ $message }}</p>
        </section>
    @elseif ($status === 'error')
        <section class="flash-errors">
            <h2 class="flash-title">実行失敗</h2>
            <p class="flash-body">{{ $message }}</p>
        </section>
    @endif

    <section class="flash-warn">
        この操作は <strong>{{ $databaseName }}</strong> を初期化します。既存データは削除されるため、必要なデータがある場合は事前に退避してください。
    </section>

    <form method="POST" class="stack section-line" onsubmit="return confirm('データベースを初期化します。実行してよいですか？');">
        @csrf
        <div class="actions">
            <button type="submit" class="button button-primary">初期化を実行する</button>
        </div>
        <p class="subtle">実行内容: `php artisan migrate:fresh --seed --force`</p>
    </form>

    <section class="section-line">
        <div class="header" style="margin-bottom: 16px;">
            <div>
                <h2 style="margin: 0; font-size: 20px;">Legacy SQL 参照</h2>
                <p class="subtle">旧 `backend/database` 配下の SQL をプレビュー表示しています。</p>
            </div>
        </div>

        <div class="sql-grid">
            <section class="sql-panel">
                <header class="sql-header">schema.sql</header>
                <pre class="sql-body"><code>{{ $schemaSql }}</code></pre>
            </section>
            <section class="sql-panel">
                <header class="sql-header">truncate.sql</header>
                <pre class="sql-body sql-body-warn"><code>{{ $truncateSql }}</code></pre>
            </section>
            <section class="sql-panel">
                <header class="sql-header">insert_data.sql</header>
                <pre class="sql-body sql-body-ok"><code>{{ $insertSql }}</code></pre>
            </section>
        </div>
    </section>
</x-layouts.admin>
