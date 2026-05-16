import OrderItemList from './OrderItemList';
import LoadingButton from './LoadingButton';

export default function CheckoutModal({ onClose, onConfirm, open, orders, total }) {
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
          <h2 id="checkout-modal-title" className="text-2xl font-semibold text-slate-900">この内容でお会計しますか</h2>
        </div>

        <div className="flex flex-col">
          <OrderItemList orders={orders} />
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
          <LoadingButton
            className="rounded-2xl bg-sky-600 px-[18px] py-[14px] font-medium text-white transition duration-150 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onConfirm}
          >
            会計を確定する
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}
