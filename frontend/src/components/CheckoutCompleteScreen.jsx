export default function CheckoutCompleteScreen({ onBackToTop, seatNumber, total }) {
  return (
    <main className="min-h-screen font-sans text-slate-900">
      <div className="mx-auto flex min-h-screen w-[min(1240px,calc(100%-24px))] items-center justify-center py-6 pb-10 max-sm:w-[min(100%,calc(100%-16px))] max-sm:py-4 max-sm:pb-7">
        <section className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_60px_rgba(32,76,112,0.12)] max-sm:p-6">
          <h1 className="mt-2 text-2xl font-semibold leading-[0.95] text-slate-900">ありがとうございました</h1>
          <p className="mt-4 text-slate-500">席番号 {seatNumber} のレシートです。お会計をお願いします。</p>

          <div className="mt-8 rounded-[28px] border border-slate-200 bg-sky-50 px-6 py-5">
            <p className="text-sm text-slate-500">お会計金額</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatPrice(total)}</p>
          </div>

          <button
            type="button"
            className="mt-8 inline-flex rounded-2xl bg-sky-600 px-8 py-4 text-lg font-medium text-white transition duration-150 hover:-translate-y-0.5 hover:bg-sky-700"
            onClick={onBackToTop}
          >
            トップページへ戻る
          </button>
        </section>
      </div>
    </main>
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}
