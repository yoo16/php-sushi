import { useEffect } from 'react';
import { clearStoredOrderSession } from '../utils/orderSessionStorage';

export default function useOrderBootstrap({ orderSessionService, session, setErrorMessage }) {
  const { restoredSession, setVisitId, setVisitStatus, setOrders, setTotal, setScreen, setCompletedTotal, setIsBooting } = session;

  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      try {
        const restored = await orderSessionService.restoreOrderSession(restoredSession);
        if (ignore) {
          return;
        }

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
        if (!ignore) {
          setErrorMessage(error.message);
        }
      } finally {
        if (!ignore) {
          setIsBooting(false);
        }
      }
    }

    bootstrap();

    return () => {
      ignore = true;
    };
  }, [
    orderSessionService,
    restoredSession.completedTotal,
    restoredSession.visitId,
    setCompletedTotal,
    setErrorMessage,
    setIsBooting,
    setOrders,
    setScreen,
    setTotal,
    setVisitId,
    setVisitStatus,
  ]);
}
