import LoadingModal from './LoadingModal';
import ProductCard from './ProductCard';

export default function ProductGrid({ baseUrl, disabled, loading, products, onSelectProduct }) {
  if (!products.length) {
    return (
      <>
        {loading ? <LoadingModal message="商品を読み込んでいます..." /> : null}
        <div className="grid min-h-56 place-items-center rounded-3xl border border-dashed border-slate-300 bg-white/70 text-slate-500">
          このカテゴリの商品はまだありません。
        </div>
      </>
    );
  }

  return (
    <>
      {loading ? <LoadingModal message="商品を読み込んでいます..." /> : null}
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            baseUrl={baseUrl}
            disabled={disabled}
            product={product}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </>
  );
}
