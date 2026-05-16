export default function useCheckoutAction({ orderService, session, messages }) {
  async function handleBill() {
    messages.setErrorMessage('');

    try {
      const response = await orderService.checkoutOrder(session.visitId);
      const billedTotal = Number(response.total ?? session.total ?? 0);
      session.setCompletedTotal(billedTotal);
      messages.setFlashMessage('');
      session.setVisitId(0);
      session.setVisitStatus('seated');
      session.setOrders([]);
      session.setTotal(0);
      session.setScreen('complete');
      return true;
    } catch (error) {
      messages.setErrorMessage(error.message);
      return false;
    }
  }

  return {
    handleBill,
  };
}
