import OrderItemList from './OrderItemList';

export default function OrderSummary({ baseUrl, disabled, loading, onBill, orders, total }) {
  return (
    <aside className="flex flex-col rounded-[28px] bg-white border border-slate-200 p-2">
      <div className="flex items-end justify-between gap-3 px-4 py-2">
        <h2 className="text-xl font-semibold text-slate-900">注文履歴</h2>
      </div>

      <OrderItemList baseUrl={baseUrl} orders={orders} />

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

function formatPrice(value) {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}
