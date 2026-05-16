export default function ProductCard({ baseUrl, disabled, onSelectProduct, product }) {
  return (
    <button
      type="button"
      className="rounded-3xl border border-slate-200 from-white to-sky-50 p-4 text-center shadow-[0_24px_60px_rgba(32,76,112,0.12)] transition duration-150 enabled:hover:-translate-y-1 enabled:hover:shadow-[0_28px_70px_rgba(32,76,112,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled}
      onClick={() => onSelectProduct(product)}
    >
      <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl">
        <img
          className="h-full w-full object-contain"
          src={buildAssetUrl(baseUrl, product.image_path)}
          alt={product.name}
        />
      </div>
      <div className="px-1 pb-1 pt-2 text-center">
        <h2 className="text-base font-semibold leading-6 text-slate-900">{product.name}</h2>
        <p className="py-2 text-sm text-slate-500">{formatPrice(product.price)}</p>
        <span className="inline-flex items-center rounded-full bg-sky-100 px-4 py-2 text-sm font-bold text-sky-700">
          注文
        </span>
      </div>
    </button>
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
