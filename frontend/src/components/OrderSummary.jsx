export default function OrderSummary({ baseUrl, disabled, loading, onBill, orders, total }) {
  return (
    <aside className="flex min-h-full flex-col rounded-[28px] border border-slate-200 bg-white/90 p-[22px] shadow-[0_24px_60px_rgba(32,76,112,0.12)]">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-sky-700">Current Order</p>
          <h2 className="mt-1.5 text-2xl font-semibold text-slate-900">注文履歴</h2>
        </div>
        <strong className="text-2xl font-semibold text-slate-900">{formatPrice(total)}</strong>
      </div>

      <div className="my-[18px] flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1">
        {orders.length ? (
          orders.map((order) => (
            <article className="flex items-center justify-between gap-3 rounded-[20px] bg-sky-50/90 p-3 max-sm:flex-col max-sm:items-stretch" key={order.id}>
              {order.product_image_path ? (
                <img
                  className="h-[60px] w-[60px] flex-none overflow-hidden rounded-2xl bg-sky-100 object-cover max-sm:h-[140px] max-sm:w-full"
                  src={buildAssetUrl(baseUrl, order.product_image_path)}
                  alt={order.product_name}
                />
              ) : (
                <div className="grid h-[60px] w-[60px] flex-none place-items-center rounded-2xl bg-sky-100 text-slate-400 max-sm:h-[140px] max-sm:w-full" />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-slate-900">{order.product_name}</h3>
                <p className="mt-2 text-sm text-slate-500">{formatPrice(order.price)} / 1皿</p>
              </div>
              <div className="text-right max-sm:text-left">
                <span className="mb-1 block text-sm text-slate-500">×{order.quantity}</span>
                <strong className="text-base font-semibold text-slate-900">{formatPrice(Number(order.price) * Number(order.quantity))}</strong>
              </div>
            </article>
          ))
        ) : (
          <div className="grid min-h-56 place-items-center rounded-3xl border border-dashed border-slate-300 bg-white/70 text-slate-500">
            まだ注文はありません。
          </div>
        )}
      </div>

      <button
        type="button"
        className="mt-auto rounded-2xl bg-sky-600 px-[18px] py-[14px] font-medium text-white transition duration-150 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled || loading}
        onClick={onBill}
      >
        {loading ? '会計処理中...' : 'お会計へ進む'}
      </button>
    </aside>
  );
}

function buildAssetUrl(baseUrl, path) {
  return `${String(baseUrl).replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`;
}

function formatPrice(value) {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}
