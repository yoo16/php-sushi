import { useState } from 'react';
import { getInitialSeatId, getInitialSeatNumber, getStoredOrderSession } from '../utils/orderSessionStorage';

const ALL_CATEGORY_ID = 0;

export default function useOrderAppState(config) {
  const restoredSession = getStoredOrderSession();

  const [seats, setSeats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_ID);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isStartingOrder, setIsStartingOrder] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isBilling, setIsBilling] = useState(false);
  const [visitId, setVisitId] = useState(restoredSession.visitId);
  const [visitStatus, setVisitStatus] = useState(config.visitStatus ?? 'seated');
  const [completedTotal, setCompletedTotal] = useState(restoredSession.completedTotal);
  const [screen, setScreen] = useState(restoredSession.screen);
  const [errorMessage, setErrorMessage] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [selectedSeatId, setSelectedSeatId] = useState(() => getInitialSeatId(config));
  const [selectedSeatNumber, setSelectedSeatNumber] = useState(() => getInitialSeatNumber(config));

  return {
    restoredSession,
    seats,
    setSeats,
    categories,
    setCategories,
    products,
    setProducts,
    orders,
    setOrders,
    total,
    setTotal,
    selectedCategory,
    setSelectedCategory,
    selectedProduct,
    setSelectedProduct,
    isCheckoutOpen,
    setIsCheckoutOpen,
    isBooting,
    setIsBooting,
    isStartingOrder,
    setIsStartingOrder,
    isProductsLoading,
    setIsProductsLoading,
    isSubmittingOrder,
    setIsSubmittingOrder,
    isBilling,
    setIsBilling,
    visitId,
    setVisitId,
    visitStatus,
    setVisitStatus,
    completedTotal,
    setCompletedTotal,
    screen,
    setScreen,
    errorMessage,
    setErrorMessage,
    flashMessage,
    setFlashMessage,
    selectedSeatId,
    setSelectedSeatId,
    selectedSeatNumber,
    setSelectedSeatNumber,
    seatId: selectedSeatId,
    seatNumber: selectedSeatNumber ?? '-',
    isOrderClosed: visitStatus !== 'seated',
    orderCount: orders.reduce((sum, order) => sum + Number(order.quantity ?? 0), 0),
    allCategoryId: ALL_CATEGORY_ID,
  };
}
