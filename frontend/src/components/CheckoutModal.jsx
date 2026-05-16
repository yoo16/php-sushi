export default function CheckoutModal({ baseUrl, loading, onClose, onConfirm, open, orders, total }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-sky-50/90 p-5 backdrop-blur-sm" role="presentation" onClick={onClose}>
      <div
        className="max-h-[calc(100vh-40px)] w-full max-w-[840px] overflow-auto rounded-[32px] border border-slate-200 bg-white p-[26px] shadow-[0_32px_90px_rgba(20,56,83,0.18)] max-sm:rounded-3xl max-sm:p-[18px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-sky-700">Checkout</p>
          <h2 id="checkout-modal-title" className="mt-1.5 text-2xl font-semibold text-slate-900">この内容でお会計しますか</h2>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {orders.map((order) => (
            <article key={order.id} className="flex items-center justify-between gap-3 rounded-[20px] bg-sky-50/90 p-3 max-sm:flex-col max-sm:items-stretch">
              <div className="flex min-w-0 items-center gap-3">
                {order.product_image_path ? (
                  <img
                    className="h-[60px] w-[60px] flex-none rounded-2xl bg-sky-100 object-cover"
                    src={buildAssetUrl(baseUrl, order.product_image_path)}
                    alt={order.product_name}
                  />
                ) : (
                  <div className="grid h-[60px] w-[60px] flex-none place-items-center rounded-2xl bg-sky-100 text-slate-400" />
                )}
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{order.product_name}</h3>
                  <p className="mt-2 text-sm text-slate-500">{formatPrice(order.price)} / 1皿</p>
                </div>
              </div>
              <div className="text-right max-sm:text-left">
                <span className="mb-1 block text-sm text-slate-500">×{order.quantity}</span>
                <strong className="text-base font-semibold text-slate-900">{formatPrice(Number(order.price) * Number(order.quantity))}</strong>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-[22px] bg-sky-50 px-5 py-[18px]">
          <span className="font-medium text-slate-700">合計金額</span>
          <strong className="text-2xl font-semibold text-slate-900">{formatPrice(total)}</strong>
        </div>

        <div className="mt-[22px] flex justify-end gap-3 max-sm:flex-col">
          <button
            type="button"
            className="rounded-2xl bg-slate-100 px-[18px] py-[14px] font-medium text-slate-800 transition duration-150 hover:-translate-y-0.5"
            onClick={onClose}
          >
            戻る
          </button>
          <button
            type="button"
            className="rounded-2xl bg-sky-600 px-[18px] py-[14px] font-medium text-white transition duration-150 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? '会計処理中...' : '会計を確定する'}
          </button>
        </div>
      </div>
    </div>
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
