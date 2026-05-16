const ALL_CATEGORY_ID = 0;

export default function CategoryTabs({ categories, selectedCategory, onChange }) {
  const items = [{ id: ALL_CATEGORY_ID, name: 'すべて' }, ...categories];

  return (
    <div className="mb-5 flex flex-wrap gap-2.5" role="tablist" aria-label="商品カテゴリ">
      {items.map((category) => {
        const isActive = Number(selectedCategory) === Number(category.id);

        return (
          <button
            key={category.id}
            type="button"
            className={[
              'rounded-full border px-4 py-3 text-sm font-medium transition duration-150',
              isActive
                ? 'border-sky-600 bg-sky-600 text-white'
                : 'border-transparent bg-sky-50 text-slate-800 hover:-translate-y-0.5 hover:bg-sky-100',
            ].join(' ')}
            onClick={() => onChange(Number(category.id))}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
