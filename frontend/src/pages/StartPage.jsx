import { useOrderApp } from '../context/OrderAppContext';
import MessageStack from '../components/MessageStack';
import StartScreen from '../components/StartScreen';

export default function StartPage() {
  const { seat, session, messages, actions } = useOrderApp();

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
        onStart={actions.handleStartOrder}
      />
    </>
  );
}
