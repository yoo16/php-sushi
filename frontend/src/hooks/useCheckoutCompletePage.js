import { useMessages } from '../context/MessagesContext';
import { useOrderSessionContext } from '../context/SessionContext';
import { useSeat } from '../context/SeatContext';
import useReturnToTopAction from './useReturnToTopAction';

export default function useCheckoutCompletePage() {
  const seat = useSeat();
  const session = useOrderSessionContext();
  const messages = useMessages();
  const { returnToTopScreen } = useReturnToTopAction({
    session,
    messages,
  });

  return {
    seatNumber: seat.seatNumber,
    total: session.completedTotal,
    returnToTopScreen,
  };
}
