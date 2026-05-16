export default function StartScreen({ loading, onSeatChange, onStart, seatId, seats }) {
  return (
    <main className="min-h-screen font-sans text-slate-900">
      <div className="mx-auto flex min-h-screen w-[min(1240px,calc(100%-24px))] items-center justify-center py-6 pb-10 max-sm:w-[min(100%,calc(100%-16px))] max-sm:py-4 max-sm:pb-7">
        <section className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_60px_rgba(32,76,112,0.12)] max-sm:p-6">
          <div className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-sky-700">
            <img src="/images/site_logo.png" alt="" />
          </div>

          <div className="mt-4 flex justify-center">
            <label className="w-full max-w-xs text-left">
              <span className="mb-2 block text-sm text-slate-500">座席を選択</span>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                value={seatId}
                onChange={(event) => onSeatChange(Number(event.target.value))}
              >
                <option value={0}>座席を選択してください</option>
                {seats.map((seat) => (
                  <option key={seat.id} value={seat.id}>
                    席番号 {seat.number}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-2 rounded-[28px] px-6 py-5">
            <p className="text-slate-500">
              ご注文は下のボタンからどうぞ！
            </p>
          </div>

          <button
            type="button"
            className="mt-8 rounded-2xl bg-black px-8 py-4 text-lg font-medium text-white transition duration-150 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading || Number(seatId) <= 0}
            onClick={onStart}
          >
            {loading ? '開始準備中...' : '注文を開始する'}
          </button>
        </section>
      </div>
    </main>
  );
}
