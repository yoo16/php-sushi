export function createOrderService(apiClient) {
  return {
    async loadOrders(visitId, options = {}) {
      if (Number(visitId) <= 0) {
        return {
          orders: [],
          total: 0,
        };
      }

      const ordersResponse = await apiClient.get('order/fetch.php', {
        visit_id: String(visitId),
      }, options);

      return {
        orders: ordersResponse.orders ?? [],
        total: ordersResponse.total ?? 0,
      };
    },

    async submitOrder(visitId, product, quantity, options = {}) {
      return apiClient.post('order/add.php', {
        product_id: Number(product.id),
        product_name: product.name,
        product_image_path: product.image_path,
        quantity,
        visit_id: visitId,
      }, options);
    },

    async checkoutOrder(visitId, options = {}) {
      return apiClient.get('order/billed.php', {
        visit_id: String(visitId),
      }, options);
    },
  };
}
