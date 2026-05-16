export default function CheckoutModal({ baseUrl, loading, onClose, onConfirm, open, orders, total }) {
  if (!open) {
    return null;
  }

  return (
    <div className="overlay-shell" role="presentation" onClick={onClose}>
      <div
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="overlay-header">
          <p className="section-eyebrow">Checkout</p>
          <h2 id="checkout-modal-title">この内容でお会計しますか</h2>
        </div>

        <div className="checkout-list">
          {orders.map((order) => (
            <article key={order.id} className="checkout-row">
              <div className="checkout-row-main">
                {order.product_image_path ? (
                  <img
                    className="checkout-thumb"
                    src={buildAssetUrl(baseUrl, order.product_image_path)}
                    alt={order.product_name}
                  />
                ) : (
                  <div className="checkout-thumb checkout-thumb-fallback" />
                )}
                <div>
                  <h3>{order.product_name}</h3>
                  <p>{formatPrice(order.price)} / 1皿</p>
                </div>
              </div>
              <div className="checkout-row-side">
                <span>×{order.quantity}</span>
                <strong>{formatPrice(Number(order.price) * Number(order.quantity))}</strong>
              </div>
            </article>
          ))}
        </div>

        <div className="checkout-total">
          <span>合計金額</span>
          <strong>{formatPrice(total)}</strong>
        </div>

        <div className="overlay-actions">
          <button type="button" className="ghost-button" onClick={onClose}>
            戻る
          </button>
          <button type="button" className="primary-button" disabled={loading} onClick={onConfirm}>
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
