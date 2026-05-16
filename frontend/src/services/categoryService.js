export function createCategoryService(apiClient) {
  return {
    async loadCategories() {
      const response = await apiClient.get('category/fetch.php');

      return response.categories ?? [];
    },
  };
}
