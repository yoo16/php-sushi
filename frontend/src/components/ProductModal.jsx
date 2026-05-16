import { useEffect, useState } from 'react';
import { useAppConfig } from '../context/AppConfigContext';
import { buildAssetUrl } from '../utils/assetUrl';
import LoadingButton from './LoadingButton';

export default function ProductModal({ disabled, onClose, onConfirm, product }) {
  const { assetBaseUrl = '/' } = useAppConfig();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-sky-50/90 p-5 backdrop-blur-sm" role="presentation" onClick={onClose}>
      <div
        className="max-h-[calc(100vh-40px)] w-full max-w-[840px] overflow-auto rounded-[32px] border border-slate-200 bg-white p-[26px] shadow-[0_32px_90px_rgba(20,56,83,0.18)] max-sm:rounded-3xl max-sm:p-[18px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div>
          <h2 id="product-modal-title" className="mt-1.5 text-2xl font-semibold text-slate-900">{product.name}</h2>
        </div>

        <div className="mt-[18px] grid items-start gap-6 md:grid-cols-[minmax(260px,0.9fr)_minmax(0,1fr)]">
          <div className="max-h-80 min-h-[220px] overflow-hidden rounded-[26px] bg-gradient-to-b from-sky-50 to-sky-100">
            {product.image_path ? (
              <img
                className="h-full w-full object-cover"
                src={buildAssetUrl(assetBaseUrl, product.image_path)}
                alt={product.name}
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-slate-400">No Image</div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-2xl font-semibold text-slate-900">{formatPrice(product.price)}</p>
            <p className="text-slate-500">数量を選んで注文すると、現在の注文一覧に追加されます。</p>

            <div className="flex items-center justify-between gap-4 rounded-[20px] bg-sky-50/95 px-[18px] py-4 max-sm:flex-col max-sm:items-stretch">
              <span className="font-medium text-slate-800">数量</span>
              <div className="flex items-center gap-2.5 self-end max-sm:self-auto">
                <button
                  type="button"
                  className="h-11 w-11 rounded-full bg-sky-600 text-xl text-white"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  -
                </button>
                <strong className="min-w-[2ch] text-center text-xl font-semibold text-slate-900">{quantity}</strong>
                <button
                  type="button"
                  className="h-11 w-11 rounded-full bg-sky-600 text-xl text-white"
                  onClick={() => setQuantity((current) => current + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[22px] flex justify-end gap-3 max-sm:flex-col">
          <button
            type="button"
            className="rounded-2xl bg-slate-100 px-[18px] py-[14px] font-medium text-slate-800 transition duration-150 hover:-translate-y-0.5"
            onClick={onClose}
          >
            閉じる
          </button>
          <LoadingButton
            className="rounded-2xl bg-sky-600 px-[18px] py-[14px] font-medium text-white transition duration-150 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled}
            onClick={() => onConfirm(quantity)}
          >
            注文
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
