import MessageStack from '../components/MessageStack';
import StartScreen from '../components/StartScreen';
import useStartPage from '../hooks/useStartPage';

export default function StartPage() {
  const { seat, messages, handleStartOrder } = useStartPage();

  return (
    <>
      <MessageStack
        errorMessage={messages.errorMessage}
        flashMessage={messages.flashMessage}
        isOrderClosed={false}
      />
      <StartScreen
        seatId={seat.seatId}
        seats={seat.seats}
        onSeatChange={seat.handleSeatChange}
        onStart={handleStartOrder}
      />
    </>
  );
}
