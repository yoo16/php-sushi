import { addOrder, billVisit, fetchOrders, fetchVisit, joinVisit } from '../services/api';
import { ensureVisitSession, playThanksVoice } from '../utils/orderSession';

export default function useOrderFlow({ apiBaseUrl, seat, menu, session, messages }) {
  async function refreshOrders(nextVisitId = session.visitId) {
    if (Number(nextVisitId) <= 0) {
      session.setOrders([]);
      session.setTotal(0);
      return;
    }

    const ordersResponse = await fetchOrders(apiBaseUrl, nextVisitId);
    session.setOrders(ordersResponse.orders ?? []);
    session.setTotal(ordersResponse.total ?? 0);
  }

  async function handleStartOrder() {
    session.setIsStartingOrder(true);
    messages.setErrorMessage('');
    messages.setFlashMessage('');
    session.setCompletedTotal(0);

    try {
      const resolvedVisit = await ensureVisitSession(apiBaseUrl, seat.seatId, session.visitId, {
        fetchVisit,
        joinVisit,
      });
      if (!resolvedVisit) {
        throw new Error('有効な注文セッションを開始できませんでした。');
      }

      const ordersResponse = await fetchOrders(apiBaseUrl, resolvedVisit.id);
      session.setVisitId(Number(resolvedVisit.id));
      session.setVisitStatus(resolvedVisit.status ?? 'seated');
      session.setOrders(ordersResponse.orders ?? []);
      session.setTotal(ordersResponse.total ?? 0);
      menu.resetCatalogState();
      session.setScreen('ordering');
      session.setCompletedTotal(0);
    } catch (error) {
      messages.setErrorMessage(error.message);
    } finally {
      session.setIsStartingOrder(false);
    }
  }

  async function handleAddOrder(product, quantity) {
    if (!product) {
      return;
    }

    session.setIsSubmittingOrder(true);
    messages.setErrorMessage('');

    try {
      await addOrder(apiBaseUrl, {
        product_id: Number(product.id),
        product_name: product.name,
        product_image_path: product.image_path,
        quantity,
        visit_id: session.visitId,
      });
      await refreshOrders(session.visitId);
      playThanksVoice();
      messages.setFlashMessage(`${product.name} を ${quantity} 皿追加しました。`);
      return true;
    } catch (error) {
      messages.setErrorMessage(error.message);
      return false;
    } finally {
      session.setIsSubmittingOrder(false);
    }
  }

  async function handleBill() {
    session.setIsBilling(true);
    messages.setErrorMessage('');

    try {
      const response = await billVisit(apiBaseUrl, session.visitId);
      const billedTotal = Number(response.total ?? session.total ?? 0);
      session.setCompletedTotal(billedTotal);
      messages.setFlashMessage('');
      transitionToCompleteScreen();
      return true;
    } catch (error) {
      messages.setErrorMessage(error.message);
      return false;
    } finally {
      session.setIsBilling(false);
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
