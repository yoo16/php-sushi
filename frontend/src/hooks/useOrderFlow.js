import { addOrder, billVisit, fetchOrders, fetchVisit, joinVisit } from '../services/api';
import { ensureVisitSession, playThanksVoice } from '../utils/orderSession';

const ALL_CATEGORY_ID = 0;

export default function useOrderFlow({
  apiBaseUrl,
  seatId,
  visitId,
  total,
  selectedProduct,
  setVisitId,
  setVisitStatus,
  setOrders,
  setTotal,
  setSelectedCategory,
  setScreen,
  setCompletedTotal,
  setErrorMessage,
  setFlashMessage,
  setIsStartingOrder,
  setIsSubmittingOrder,
  setIsBilling,
  setIsCheckoutOpen,
  setSelectedProduct,
}) {
  async function refreshOrders(nextVisitId = visitId) {
    if (Number(nextVisitId) <= 0) {
      setOrders([]);
      setTotal(0);
      return;
    }

    const ordersResponse = await fetchOrders(apiBaseUrl, nextVisitId);
    setOrders(ordersResponse.orders ?? []);
    setTotal(ordersResponse.total ?? 0);
  }

  async function handleStartOrder() {
    setIsStartingOrder(true);
    setErrorMessage('');
    setFlashMessage('');
    setCompletedTotal(0);

    try {
      const resolvedVisit = await ensureVisitSession(apiBaseUrl, seatId, visitId, {
        fetchVisit,
        joinVisit,
      });
      if (!resolvedVisit) {
        throw new Error('有効な注文セッションを開始できませんでした。');
      }

      const ordersResponse = await fetchOrders(apiBaseUrl, resolvedVisit.id);
      setVisitId(Number(resolvedVisit.id));
      setVisitStatus(resolvedVisit.status ?? 'seated');
      setOrders(ordersResponse.orders ?? []);
      setTotal(ordersResponse.total ?? 0);
      setSelectedCategory(ALL_CATEGORY_ID);
      setScreen('ordering');
      setCompletedTotal(0);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsStartingOrder(false);
    }
  }

  async function handleAddOrder(quantity) {
    if (!selectedProduct) {
      return;
    }

    setIsSubmittingOrder(true);
    setErrorMessage('');

    try {
      await addOrder(apiBaseUrl, {
        product_id: Number(selectedProduct.id),
        product_name: selectedProduct.name,
        product_image_path: selectedProduct.image_path,
        quantity,
        visit_id: visitId,
      });
      await refreshOrders();
      playThanksVoice();
      setFlashMessage(`${selectedProduct.name} を ${quantity} 皿追加しました。`);
      setSelectedProduct(null);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmittingOrder(false);
    }
  }

  async function handleBill() {
    setIsBilling(true);
    setErrorMessage('');

    try {
      const response = await billVisit(apiBaseUrl, visitId);
      const billedTotal = Number(response.total ?? total ?? 0);
      setCompletedTotal(billedTotal);
      setFlashMessage('');
      transitionToCompleteScreen();
      return true;
    } catch (error) {
      setErrorMessage(error.message);
      return false;
    } finally {
      setIsBilling(false);
    }
  }

  function transitionToCompleteScreen() {
    setVisitId(0);
    setVisitStatus('seated');
    setOrders([]);
    setTotal(0);
    setSelectedProduct(null);
    setSelectedCategory(ALL_CATEGORY_ID);
    setIsCheckoutOpen(false);
    setScreen('complete');
  }

  function returnToTopScreen() {
    setCompletedTotal(0);
    setFlashMessage('');
    setErrorMessage('');
    setScreen('start');
  }

  return {
    refreshOrders,
    handleStartOrder,
    handleAddOrder,
    handleBill,
    returnToTopScreen,
  };
}
