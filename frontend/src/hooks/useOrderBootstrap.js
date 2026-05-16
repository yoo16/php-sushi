import { useEffect } from 'react';
import { fetchCategories, fetchOrders, fetchSeats, fetchVisit } from '../services/api';
import { clearStoredOrderSession, persistOrderSession, persistSelectedSeat } from '../utils/orderSessionStorage';

export default function useOrderBootstrap({
  apiBaseUrl,
  restoredSession,
  selectedSeatId,
  setCategories,
  setSeats,
  setSelectedSeatId,
  setSelectedSeatNumber,
  setVisitId,
  setVisitStatus,
  setOrders,
  setTotal,
  setScreen,
  setCompletedTotal,
  setErrorMessage,
  setIsBooting,
  visitId,
  screen,
  completedTotal,
}) {
  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      try {
        const [categoriesResponse, seatsResponse] = await Promise.all([
          fetchCategories(apiBaseUrl),
          fetchSeats(apiBaseUrl),
        ]);

        if (ignore) {
          return;
        }

        setCategories(categoriesResponse.categories ?? []);
        const nextSeats = seatsResponse.seats ?? [];
        setSeats(nextSeats);

        const matchedSeat = nextSeats.find((seat) => Number(seat.id) === Number(selectedSeatId));
        if (matchedSeat) {
          setSelectedSeatNumber(matchedSeat.number);
        } else if (nextSeats.length === 1) {
          setSelectedSeatId(Number(nextSeats[0].id));
          setSelectedSeatNumber(nextSeats[0].number);
          persistSelectedSeat(nextSeats[0].id, nextSeats[0].number);
        }

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
    selectedSeatId,
    setCategories,
    setCompletedTotal,
    setErrorMessage,
    setIsBooting,
    setOrders,
    setScreen,
    setSeats,
    setSelectedSeatId,
    setSelectedSeatNumber,
    setTotal,
    setVisitId,
    setVisitStatus,
  ]);

  useEffect(() => {
    persistOrderSession({
      visitId,
      screen,
      completedTotal,
    });
  }, [completedTotal, screen, visitId]);
}
