import LoadingOverlay from './LoadingOverlay';
import ProductCard from './ProductCard';

export default function ProductGrid({ disabled, loading, products, onSelectProduct }) {
  if (!products.length) {
    return (
      <>
        {loading ? <LoadingOverlay message="商品を読み込んでいます..." /> : null}
        <div className="grid min-h-56 place-items-center rounded-3xl border border-dashed border-slate-300 bg-white/70 text-slate-500">
          このカテゴリの商品はまだありません。
        </div>
      </>
    );
  }

  return (
    <>
      {loading ? <LoadingOverlay message="商品を読み込んでいます..." /> : null}
      <div className="grid grid-cols-4 gap-2">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            disabled={disabled}
            product={product}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </>
  );
}
