import CheckoutCompleteScreen from '../components/CheckoutCompleteScreen';
import useCheckoutCompletePage from '../hooks/useCheckoutCompletePage';

export default function CheckoutCompletePage() {
  const { seatNumber, total, returnToTopScreen } = useCheckoutCompletePage();

  return (
    <CheckoutCompleteScreen
      onBackToTop={returnToTopScreen}
      seatNumber={seatNumber}
      total={total}
    />
  );
}
