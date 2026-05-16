import { persistSelectedSeat } from '../utils/orderSessionStorage';

export default function useSeatSelection({ seats, setSelectedSeatId, setSelectedSeatNumber, setErrorMessage }) {
  function handleSeatChange(nextSeatId) {
    const seat = seats.find((item) => Number(item.id) === Number(nextSeatId));
    const nextSeatNumber = seat?.number ?? '-';

    setSelectedSeatId(nextSeatId);
    setSelectedSeatNumber(nextSeatNumber);
    persistSelectedSeat(nextSeatId, nextSeatNumber);
    setErrorMessage('');
  }

  return {
    handleSeatChange,
  };
}
