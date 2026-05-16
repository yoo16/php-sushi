import { startTransition, useEffect } from 'react';
import { useState } from 'react';

const ALL_CATEGORY_ID = 0;

export default function useProductCatalog({ categoryService, productService, screen, setErrorMessage }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_ID);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const categories = await categoryService.loadCategories();
        if (!ignore) {
          setCategories(categories);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      }
    }

    loadCategories();

    return () => {
      ignore = true;
    };
  }, [categoryService, setErrorMessage]);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      if (screen !== 'ordering') {
        return;
      }

      setIsProductsLoading(true);

      try {
        const products = await productService.loadProducts(selectedCategory);
        if (!ignore) {
          setProducts(products);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      } finally {
        if (!ignore) {
          setIsProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [productService, screen, selectedCategory, setErrorMessage, setIsProductsLoading, setProducts]);

  function handleCategoryChange(categoryId) {
    setErrorMessage('');
    startTransition(() => {
      setSelectedCategory(categoryId);
    });
  }

  function resetCatalogState() {
    setSelectedCategory(ALL_CATEGORY_ID);
  }

  return {
    categories,
    products,
    selectedCategory,
    isProductsLoading,
    handleCategoryChange,
    resetCatalogState,
  };
}
