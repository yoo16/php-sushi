import { useState } from 'react';
import { useOrderApp } from '../context/OrderAppContext';

export default function useOrderingPage() {
  const { seat, menu, session, messages, actions } = useOrderApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function openCheckout() {
    setIsCheckoutOpen(true);
  }

  function closeCheckout() {
    setIsCheckoutOpen(false);
  }

  function closeProductModal() {
    setSelectedProduct(null);
  }

  async function handleConfirmCheckout() {
    const succeeded = await actions.handleBill();
    if (succeeded) {
      closeCheckout();
    }
  }

  async function handleConfirmProduct(quantity) {
    const succeeded = await actions.handleAddOrder(selectedProduct, quantity);
    if (succeeded) {
      closeProductModal();
    }
  }

  return {
    seat,
    menu,
    session,
    messages,
    isCheckoutOpen,
    selectedProduct,
    openCheckout,
    closeCheckout,
    closeProductModal,
    handleConfirmCheckout,
    handleConfirmProduct,
    setSelectedProduct,
  };
}
