import { useOrderApp } from '../context/OrderAppContext';
import CheckoutCompleteScreen from '../components/CheckoutCompleteScreen';

export default function CheckoutCompletePage() {
  const { seat, session, actions } = useOrderApp();

  return (
    <CheckoutCompleteScreen
      onBackToTop={actions.returnToTopScreen}
      seatNumber={seat.seatNumber}
      total={session.completedTotal}
    />
  );
}
