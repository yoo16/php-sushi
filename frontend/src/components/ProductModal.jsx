import { useEffect, useState } from 'react';

export default function ProductModal({ baseUrl, disabled, loading, onClose, onConfirm, product }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (!product) {
    return null;
  }

  return (
    <div className="overlay-shell" role="presentation" onClick={onClose}>
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="overlay-header">
          <p className="section-eyebrow">Selected Item</p>
          <h2 id="product-modal-title">{product.name}</h2>
        </div>

        <div className="product-modal-body">
          <div className="product-modal-visual">
            {product.image_path ? (
              <img
                className="modal-image"
                src={buildAssetUrl(baseUrl, product.image_path)}
                alt={product.name}
              />
            ) : (
              <div className="modal-image product-image-fallback">No Image</div>
            )}
          </div>

          <div className="modal-copy">
            <p className="modal-price">{formatPrice(product.price)}</p>
            <p className="modal-description">数量を選んで注文すると、現在の注文一覧に追加されます。</p>

            <div className="quantity-row">
              <span>数量</span>
              <div className="quantity-control">
                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                  -
                </button>
                <strong>{quantity}</strong>
                <button type="button" onClick={() => setQuantity((current) => current + 1)}>
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overlay-actions">
          <button type="button" className="ghost-button" onClick={onClose}>
            閉じる
          </button>
          <button
            type="button"
            className="primary-button"
            disabled={disabled || loading}
            onClick={() => onConfirm(quantity)}
          >
            {loading ? '追加中...' : `${quantity} 皿を注文`}
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
