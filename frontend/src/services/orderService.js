export function createOrderService(apiClient) {
  return {
    async loadOrders(visitId) {
      if (Number(visitId) <= 0) {
        return {
          orders: [],
          total: 0,
        };
      }

      const ordersResponse = await apiClient.get('order/fetch.php', {
        visit_id: String(visitId),
      });

      return {
        orders: ordersResponse.orders ?? [],
        total: ordersResponse.total ?? 0,
      };
    },

    async submitOrder(visitId, product, quantity) {
      return apiClient.post('order/add.php', {
        product_id: Number(product.id),
        product_name: product.name,
        product_image_path: product.image_path,
        quantity,
        visit_id: visitId,
      });
    },

    async checkoutOrder(visitId) {
      return apiClient.get('order/billed.php', {
        visit_id: String(visitId),
      });
    },
  };
}
