export default function OrderSummary({ baseUrl, disabled, loading, onBill, orders, total }) {
  return (
    <aside className="order-panel page-card">
      <div className="order-panel-header">
        <div>
          <p className="section-eyebrow">Current Order</p>
          <h2>注文履歴</h2>
        </div>
        <strong>{formatPrice(total)}</strong>
      </div>

      <div className="order-list">
        {orders.length ? (
          orders.map((order) => (
            <article className="order-row" key={order.id}>
              {order.product_image_path ? (
                <img
                  className="order-thumb"
                  src={buildAssetUrl(baseUrl, order.product_image_path)}
                  alt={order.product_name}
                />
              ) : (
                <div className="order-thumb order-thumb-fallback" />
              )}
              <div className="order-copy">
                <h3>{order.product_name}</h3>
                <p>
                  {formatPrice(order.price)} / 1皿
                </p>
              </div>
              <div className="order-meta">
                <span>×{order.quantity}</span>
                <strong>{formatPrice(Number(order.price) * Number(order.quantity))}</strong>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state order-empty">まだ注文はありません。</div>
        )}
      </div>

      <button type="button" className="primary-button order-bill-button" disabled={disabled || loading} onClick={onBill}>
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
