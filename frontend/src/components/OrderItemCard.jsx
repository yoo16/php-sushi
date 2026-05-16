export default function OrderItemCard({ baseUrl, order }) {
  return (
    <article className="flex items-center justify-between gap-3 rounded-[20px] p-3">
      <img
        className="h-[60px] w-[60px] flex-none overflow-hidden rounded-2xl object-contain"
        src={buildAssetUrl(baseUrl, order.product_image_path)}
        alt={order.product_name}
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-slate-900">{order.product_name}</h3>
        <p className="mt-2 text-sm text-slate-500">{formatPrice(order.price)} / 1皿</p>
      </div>
      <div className="text-right max-sm:text-left">
        <span className="mb-1 block text-sm text-slate-500">×{order.quantity}</span>
        <strong className="text-base font-semibold text-slate-900">{formatPrice(Number(order.price) * Number(order.quantity))}</strong>
      </div>
    </article>
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
