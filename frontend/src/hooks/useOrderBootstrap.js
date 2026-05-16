import { useEffect } from 'react';
import { fetchOrders, fetchVisit } from '../services/api';
import { clearStoredOrderSession } from '../utils/orderSessionStorage';

export default function useOrderBootstrap({ apiBaseUrl, session, setErrorMessage }) {
  const { restoredSession, setVisitId, setVisitStatus, setOrders, setTotal, setScreen, setCompletedTotal, setIsBooting } = session;

  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      try {
        if (restoredSession.visitId > 0) {
          const visitResponse = await fetchVisit(apiBaseUrl, restoredSession.visitId);
          const restoredVisit = visitResponse.visit;

          if (restoredVisit?.status === 'seated') {
            const ordersResponse = await fetchOrders(apiBaseUrl, restoredVisit.id);
            if (ignore) {
              return;
            }

            setVisitId(Number(restoredVisit.id));
            setVisitStatus(restoredVisit.status);
            setOrders(ordersResponse.orders ?? []);
            setTotal(ordersResponse.total ?? 0);
            setScreen('ordering');
          } else if (restoredVisit && ['billed', 'paid'].includes(restoredVisit.status)) {
            if (ignore) {
              return;
            }

            setCompletedTotal(Number(restoredVisit.total_with_tax ?? restoredSession.completedTotal ?? 0));
            setScreen('complete');
          } else {
            clearStoredOrderSession();
          }
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
    apiBaseUrl,
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
