import { useEffect, useState } from 'react';
import { getStoredOrderSession, persistOrderSession } from '../utils/orderSessionStorage';

export default function useOrderSession(config) {
  const [restoredSession] = useState(() => getStoredOrderSession());
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [isStartingOrder, setIsStartingOrder] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isBilling, setIsBilling] = useState(false);
  const [visitId, setVisitId] = useState(restoredSession.visitId);
  const [visitStatus, setVisitStatus] = useState(config.visitStatus ?? 'seated');
  const [completedTotal, setCompletedTotal] = useState(restoredSession.completedTotal);
  const [screen, setScreen] = useState(restoredSession.screen);

  useEffect(() => {
    persistOrderSession({
      visitId,
      screen,
      completedTotal,
    });
  }, [completedTotal, screen, visitId]);

  return {
    restoredSession,
    orders,
    setOrders,
    total,
    setTotal,
    isBooting,
    setIsBooting,
    isStartingOrder,
    setIsStartingOrder,
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
    isOrderClosed: visitStatus !== 'seated',
  };
}
