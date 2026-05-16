import { startTransition, useEffect } from 'react';
import { useState } from 'react';
import { fetchCategories, fetchProducts } from '../services/api';

const ALL_CATEGORY_ID = 0;

export default function useProductCatalog({ apiBaseUrl, screen, setErrorMessage }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_ID);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const categoriesResponse = await fetchCategories(apiBaseUrl);
        if (!ignore) {
          setCategories(categoriesResponse.categories ?? []);
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
  }, [apiBaseUrl, setErrorMessage]);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      if (screen !== 'ordering') {
        return;
      }

      setIsProductsLoading(true);

      try {
        const response = await fetchProducts(apiBaseUrl, selectedCategory);
        if (!ignore) {
          setProducts(response.products ?? response.data ?? []);
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
  }, [apiBaseUrl, screen, selectedCategory, setErrorMessage, setIsProductsLoading, setProducts]);

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
