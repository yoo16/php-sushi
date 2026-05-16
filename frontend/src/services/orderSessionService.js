export function createOrderSessionService({ visitService, orderService }) {
  return {
    async restoreOrderSession(restoredSession, options = {}) {
      if (restoredSession.visitId <= 0) {
        return {
          type: 'empty',
        };
      }

      const visitResponse = await visitService.findVisitById(restoredSession.visitId, options);
      const restoredVisit = visitResponse.visit;

      if (restoredVisit?.status === 'seated') {
        const orderData = await orderService.loadOrders(restoredVisit.id, options);

        return {
          type: 'ordering',
          visitId: Number(restoredVisit.id),
          visitStatus: restoredVisit.status,
          orders: orderData.orders,
          total: orderData.total,
        };
      }

      if (restoredVisit && ['billed', 'paid'].includes(restoredVisit.status)) {
        return {
          type: 'complete',
          completedTotal: Number(restoredVisit.total_with_tax ?? restoredSession.completedTotal ?? 0),
        };
      }

      return {
        type: 'invalid',
      };
    },

    async startOrderSession(seatId, currentVisitId, options = {}) {
      if (Number(currentVisitId) > 0) {
        const visitResponse = await visitService.findVisitById(currentVisitId, options);
        if (visitResponse.status === 'success' && visitResponse.visit) {
          return visitResponse.visit;
        }
      }

      if (Number(seatId) <= 0) {
        return null;
      }

      const joinResponse = await visitService.joinVisit(seatId, options);
      if (joinResponse.status !== 'success' || !joinResponse.visit) {
        return null;
      }

      if (typeof joinResponse.visit === 'object') {
        return joinResponse.visit;
      }

      const resolvedVisitResponse = await visitService.findVisitById(joinResponse.visit, options);
      if (resolvedVisitResponse.status === 'success' && resolvedVisitResponse.visit) {
        return resolvedVisitResponse.visit;
      }

      return null;
    },
  };
}
