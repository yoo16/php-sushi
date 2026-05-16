import MessageStack from '../components/MessageStack';
import StartScreen from '../components/StartScreen';

export default function StartPage({ seat, session, messages, actions }) {
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
        loading={session.isStartingOrder}
        onSeatChange={seat.handleSeatChange}
        onStart={actions.handleStartOrder}
      />
    </>
  );
}
