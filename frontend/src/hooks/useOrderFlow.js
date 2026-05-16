import { playThanksVoice } from '../utils/orderSession';

export default function useOrderFlow({ orderService, orderSessionService, seat, menu, session, messages }) {
  async function refreshOrders(nextVisitId = session.visitId) {
    const orderData = await orderService.loadOrders(nextVisitId);
    session.setOrders(orderData.orders);
    session.setTotal(orderData.total);
  }

  async function handleStartOrder() {
    messages.setErrorMessage('');
    messages.setFlashMessage('');
    session.setCompletedTotal(0);

    try {
      const resolvedVisit = await orderSessionService.startOrderSession(seat.seatId, session.visitId);
      if (!resolvedVisit) {
        throw new Error('有効な注文セッションを開始できませんでした。');
      }

      const orderData = await orderService.loadOrders(resolvedVisit.id);
      session.setVisitId(Number(resolvedVisit.id));
      session.setVisitStatus(resolvedVisit.status ?? 'seated');
      session.setOrders(orderData.orders);
      session.setTotal(orderData.total);
      menu.resetCatalogState();
      session.setScreen('ordering');
      session.setCompletedTotal(0);
    } catch (error) {
      messages.setErrorMessage(error.message);
    }
  }

  async function handleAddOrder(product, quantity) {
    if (!product) {
      return;
    }

    messages.setErrorMessage('');

    try {
      await orderService.submitOrder(session.visitId, product, quantity);
      await refreshOrders(session.visitId);
      playThanksVoice();
      messages.setFlashMessage(`${product.name} を ${quantity} 皿追加しました。`);
      return true;
    } catch (error) {
      messages.setErrorMessage(error.message);
      return false;
    }
  }

  async function handleBill() {
    messages.setErrorMessage('');

    try {
      const response = await orderService.checkoutOrder(session.visitId);
      const billedTotal = Number(response.total ?? session.total ?? 0);
      session.setCompletedTotal(billedTotal);
      messages.setFlashMessage('');
      transitionToCompleteScreen();
      return true;
    } catch (error) {
      messages.setErrorMessage(error.message);
      return false;
    }
  }

  function transitionToCompleteScreen() {
    session.setVisitId(0);
    session.setVisitStatus('seated');
    session.setOrders([]);
    session.setTotal(0);
    menu.resetCatalogState();
    session.setScreen('complete');
  }

  function returnToTopScreen() {
    session.setCompletedTotal(0);
    messages.setFlashMessage('');
    messages.setErrorMessage('');
    session.setScreen('start');
  }

  return {
    refreshOrders,
    handleStartOrder,
    handleAddOrder,
    handleBill,
    returnToTopScreen,
  };
}
