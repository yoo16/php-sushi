export default function ProductGrid({ baseUrl, disabled, loading, products, onSelectProduct }) {
  if (loading) {
    return <div className="empty-state">商品を読み込んでいます...</div>;
  }

  if (!products.length) {
    return <div className="empty-state">このカテゴリの商品はまだありません。</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <button
          key={product.id}
          type="button"
          className="product-card"
          disabled={disabled}
          onClick={() => onSelectProduct(product)}
        >
          <div className="product-image-wrap">
            {product.image_path ? (
              <img
                className="product-image"
                src={buildAssetUrl(baseUrl, product.image_path)}
                alt={product.name}
              />
            ) : (
              <div className="product-image product-image-fallback">No Image</div>
            )}
          </div>
          <div className="product-copy">
            <h2>{product.name}</h2>
            <p>{formatPrice(product.price)}</p>
            <span className="product-cta">注文する</span>
          </div>
        </button>
      ))}
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
