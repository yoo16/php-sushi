import CheckoutCompleteScreen from '../components/CheckoutCompleteScreen';

export default function CheckoutCompletePage({ seat, session, actions }) {
  return (
    <CheckoutCompleteScreen
      onBackToTop={actions.returnToTopScreen}
      seatNumber={seat.seatNumber}
      total={session.completedTotal}
    />
  );
}
