const ALL_CATEGORY_ID = 0;

export default function CategoryTabs({ categories, selectedCategory, onChange }) {
  const items = [{ id: ALL_CATEGORY_ID, name: 'すべて' }, ...categories];

  return (
    <div className="category-tabs" role="tablist" aria-label="商品カテゴリ">
      {items.map((category) => {
        const isActive = Number(selectedCategory) === Number(category.id);

        return (
          <button
            key={category.id}
            type="button"
            className={isActive ? 'category-tab is-active' : 'category-tab'}
            onClick={() => onChange(Number(category.id))}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
