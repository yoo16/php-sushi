<x-layouts.admin title="座席編集" active="seat">
    <div class="header">
        <div>
            <h1 class="heading">座席編集</h1>
            <p class="subtle">座席番号を更新します。</p>
        </div>
        <a href="/admin/seat/" class="button button-secondary">一覧に戻る</a>
    </div>

    @if ($errors->any())
        <div class="flash-errors">入力内容を確認してください。</div>
    @endif

    <form action="/admin/seat/update.php" method="POST" class="stack">
        @csrf
        <input type="hidden" name="id" value="{{ old('id', $seat->id) }}">

        <div>
            <label for="number">座席番号</label>
            <input id="number" type="number" name="number" min="1" value="{{ old('number', $seat->number) }}" required>
            @error('number')
                <p class="field-error">{{ $message }}</p>
            @enderror
        </div>

        <div class="actions">
            <button type="submit" class="button button-primary">更新する</button>
        </div>
    </form>
</x-layouts.admin>
