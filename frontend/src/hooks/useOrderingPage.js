import { startTransition, useEffect, useState } from 'react';
import { useMessages } from '../context/MessagesContext';
import { useOrderSessionContext } from '../context/SessionContext';
import { useSeat } from '../context/SeatContext';
import { loadCategories } from '../services/categoryService';
import { loadProducts } from '../services/productService';
import { loadOrders, submitOrder, checkoutOrder } from '../services/orderService';
import { playThanksVoice } from '../utils/audio';

const ALL_CATEGORY_ID = 0;

export default function useOrderingPage() {
  const seat = useSeat();
  const session = useOrderSessionContext();
  const messages = useMessages();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_ID);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { setErrorMessage } = messages;

  useEffect(() => {
    loadCategories()
      .then(setCategories)
      .catch((error) => setErrorMessage(error.message));
  }, [setErrorMessage]);

  useEffect(() => {
    if (session.screen !== 'ordering') return;

    let cancelled = false;
    setIsProductsLoading(true);

    loadProducts(selectedCategory)
      .then((products) => { if (!cancelled) setProducts(products); })
      .catch((error) => setErrorMessage(error.message))
      .finally(() => { if (!cancelled) setIsProductsLoading(false); });

    return () => { cancelled = true; };
  }, [setErrorMessage, selectedCategory, session.screen]);

  async function handleConfirmProduct(quantity) {
    if (!selectedProduct) return;

    setErrorMessage('');

    try {
      await submitOrder(session.visitId, selectedProduct, quantity);
      const orderData = await loadOrders(session.visitId);
      session.setOrders(orderData.orders);
      session.setTotal(orderData.total);
      playThanksVoice();
      messages.setFlashMessage(`${selectedProduct.name} を ${quantity} 皿追加しました。`);
      setSelectedProduct(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleConfirmCheckout() {
    setErrorMessage('');

    try {
      const response = await checkoutOrder(session.visitId);
      const billedTotal = Number(response.total ?? session.total ?? 0);
      session.setCompletedTotal(billedTotal);
      messages.setFlashMessage('');
      session.setVisitId(0);
      session.setVisitStatus('seated');
      session.setOrders([]);
      session.setTotal(0);
      session.setScreen('complete');
      setIsCheckoutOpen(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  function handleCategoryChange(categoryId) {
    setErrorMessage('');
    startTransition(() => setSelectedCategory(categoryId));
  }

  return {
    seat,
    session,
    messages,
    categories,
    products,
    selectedCategory,
    isProductsLoading,
    isCheckoutOpen,
    selectedProduct,
    openCheckout: () => setIsCheckoutOpen(true),
    closeCheckout: () => setIsCheckoutOpen(false),
    closeProductModal: () => setSelectedProduct(null),
    handleConfirmCheckout,
    handleConfirmProduct,
    handleCategoryChange,
    setSelectedProduct,
  };
}
