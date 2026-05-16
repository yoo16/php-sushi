export function createCategoryService(apiClient) {
  return {
    async loadCategories(options = {}) {
      const response = await apiClient.get('category/fetch.php', undefined, options);

      return response.categories ?? [];
    },
  };
}
