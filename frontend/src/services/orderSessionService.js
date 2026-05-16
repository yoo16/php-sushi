import { findVisitById, joinVisit } from './visitService';
import { loadOrders } from './orderService';
import { clearStoredOrderSession } from '../utils/orderSessionStorage';

export async function restoreOrderSession(restoredSession, options = {}) {
  if (restoredSession.visitId <= 0) {
    return { type: 'empty' };
  }

  const visitResponse = await findVisitById(restoredSession.visitId, options);
  const restoredVisit = visitResponse.visit;

  if (restoredVisit?.status === 'seated') {
    const orderData = await loadOrders(restoredVisit.id, options);
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

  return { type: 'invalid' };
}

export async function startOrderSession(seatId, currentVisitId, options = {}) {
  if (Number(currentVisitId) > 0) {
    const visitResponse = await findVisitById(currentVisitId, options);
    if (visitResponse.visit) {
      return visitResponse.visit;
    }
  }

  if (Number(seatId) <= 0) {
    return null;
  }

  const joinResponse = await joinVisit(seatId, options);
  if (!joinResponse.visit) {
    return null;
  }

  return joinResponse.visit;
}
