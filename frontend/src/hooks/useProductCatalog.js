import { startTransition, useEffect } from 'react';
import { fetchProducts } from '../services/api';

export default function useProductCatalog({
  apiBaseUrl,
  screen,
  selectedCategory,
  setProducts,
  setIsProductsLoading,
  setErrorMessage,
  setSelectedCategory,
}) {
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

  return {
    handleCategoryChange,
  };
}
