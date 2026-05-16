import { apiClient } from './api';

export async function loadCategories(options = {}) {
  const response = await apiClient.get('category/fetch.php', undefined, options);
  return response.categories ?? [];
}
