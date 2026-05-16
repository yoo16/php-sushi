import { useEffect, useState } from 'react';
import { clearStoredOrderSession, getStoredOrderSession, persistOrderSession } from '../utils/orderSessionStorage';
import { restoreOrderSession } from '../services/orderSessionService';

export default function useOrderSession(config, { setErrorMessage }) {
  const [restoredSession] = useState(() => getStoredOrderSession());
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [visitId, setVisitId] = useState(restoredSession.visitId);
  const [visitStatus, setVisitStatus] = useState(config.visitStatus ?? 'seated');
  const [completedTotal, setCompletedTotal] = useState(restoredSession.completedTotal);
  const [screen, setScreen] = useState(restoredSession.screen);

  useEffect(() => {
    persistOrderSession({ visitId, screen, completedTotal });
  }, [completedTotal, screen, visitId]);

  useEffect(() => {
    const controller = new AbortController();

    async function bootstrap() {
      try {
        const restored = await restoreOrderSession(restoredSession, {
          signal: controller.signal,
        });

        if (restored.type === 'ordering') {
          setVisitId(restored.visitId);
          setVisitStatus(restored.visitStatus);
          setOrders(restored.orders);
          setTotal(restored.total);
          setScreen('ordering');
        } else if (restored.type === 'complete') {
          setCompletedTotal(restored.completedTotal);
          setScreen('complete');
        } else if (restored.type === 'invalid') {
          clearStoredOrderSession();
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsBooting(false);
        }
      }
    }

    bootstrap();

    return () => { controller.abort(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    orders,
    setOrders,
    total,
    setTotal,
    isBooting,
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
