import { startOrderSession } from '../services/orderSessionService';
import { loadOrders } from '../services/orderService';

export default function useStartOrderAction({ seat, session, messages }) {
  async function handleStartOrder() {
    messages.setErrorMessage('');
    messages.setFlashMessage('');
    session.setCompletedTotal(0);

    try {
      const resolvedVisit = await startOrderSession(seat.seatId, session.visitId);
      if (!resolvedVisit) {
        throw new Error('有効な注文セッションを開始できませんでした。');
      }

      const orderData = await loadOrders(resolvedVisit.id);
      session.setVisitId(Number(resolvedVisit.id));
      session.setVisitStatus(resolvedVisit.status ?? 'seated');
      session.setOrders(orderData.orders);
      session.setTotal(orderData.total);
      session.setScreen('ordering');
      session.setCompletedTotal(0);
    } catch (error) {
      messages.setErrorMessage(error.message);
    }
  }

  return { handleStartOrder };
}
