import OrderItemList from './OrderItemList';
import LoadingButton from './LoadingButton';

export default function OrderSummary({ disabled, onBill, orders, total }) {
  return (
    <aside className="flex flex-col rounded-[28px] bg-white border border-slate-200 p-2">
      <div className="flex items-end justify-between gap-3 px-4 py-2">
        <h2 className="text-xl font-semibold text-slate-900">注文履歴</h2>
      </div>

      <OrderItemList orders={orders} />

      <LoadingButton
        className="mt-auto rounded-2xl bg-sky-600 px-[18px] py-[14px] font-medium text-white transition duration-150 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        onClick={onBill}
      >
        お会計へ進む
      </LoadingButton>
    </aside>
  );
}
