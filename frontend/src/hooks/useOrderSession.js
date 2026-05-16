import { useEffect, useState } from 'react';
import { getStoredOrderSession, persistOrderSession } from '../utils/orderSessionStorage';

export default function useOrderSession(config) {
  const [restoredSession] = useState(() => getStoredOrderSession());
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
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
