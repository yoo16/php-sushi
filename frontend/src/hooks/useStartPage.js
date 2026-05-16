import { useMessages } from '../context/MessagesContext';
import { useOrderSessionContext } from '../context/SessionContext';
import { useSeat } from '../context/SeatContext';
import useStartOrderAction from './useStartOrderAction';

export default function useStartPage() {
  const seat = useSeat();
  const session = useOrderSessionContext();
  const messages = useMessages();
  const { handleStartOrder } = useStartOrderAction({ seat, session, messages });

  return {
    seat,
    messages,
    handleStartOrder,
  };
}
