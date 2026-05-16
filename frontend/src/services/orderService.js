import { apiClient } from './api';

export async function loadOrders(visitId, options = {}) {
  if (Number(visitId) <= 0) {
    return { orders: [], total: 0 };
  }

  const response = await apiClient.get('order/fetch', { visit_id: String(visitId) }, options);
  return { orders: response.orders ?? [], total: response.total ?? 0 };
}

export async function submitOrder(visitId, product, quantity, options = {}) {
  return apiClient.post('order/add', {
    product_id: Number(product.id),
    product_name: product.name,
    product_image_path: product.image_path,
    quantity,
    visit_id: visitId,
  }, options);
}

export async function checkoutOrder(visitId, options = {}) {
  return apiClient.post('order/billed', { visit_id: Number(visitId) }, options);
}
