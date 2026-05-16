export function createProductService(apiClient) {
  return {
    async loadProducts(categoryId, options = {}) {
      const query = Number(categoryId) > 0 ? { category_id: String(categoryId) } : undefined;
      const response = await apiClient.get('product/fetch.php', query, options);

      return response.products ?? response.data ?? [];
    },
  };
}
