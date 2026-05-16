import { useMessages } from '../context/MessagesContext';
import { useServices } from '../context/ServicesContext';
import { useOrderSessionContext } from '../context/SessionContext';
import { useSeat } from '../context/SeatContext';
import useStartOrderAction from './useStartOrderAction';

export default function useStartPage() {
  const seat = useSeat();
  const session = useOrderSessionContext();
  const messages = useMessages();
  const services = useServices();
  const { handleStartOrder } = useStartOrderAction({
    orderService: services.orderService,
    orderSessionService: services.orderSessionService,
    seat,
    session,
    messages,
  });

  return {
    seat,
    messages,
    handleStartOrder,
  };
}
