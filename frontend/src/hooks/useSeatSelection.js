import { useEffect, useState } from 'react';
import { fetchSeats } from '../services/api';
import { getInitialSeatId, getInitialSeatNumber, persistSelectedSeat } from '../utils/orderSessionStorage';

export default function useSeatSelection({ config, apiBaseUrl, setErrorMessage }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeatId, setSelectedSeatId] = useState(() => getInitialSeatId(config));
  const [selectedSeatNumber, setSelectedSeatNumber] = useState(() => getInitialSeatNumber(config));

  useEffect(() => {
    let ignore = false;

    async function loadSeats() {
      try {
        const seatsResponse = await fetchSeats(apiBaseUrl);
        if (ignore) {
          return;
        }

        const nextSeats = seatsResponse.seats ?? [];
        setSeats(nextSeats);

        const matchedSeat = nextSeats.find((seat) => Number(seat.id) === Number(selectedSeatId));
        if (matchedSeat) {
          setSelectedSeatNumber(matchedSeat.number);
        } else if (nextSeats.length === 1) {
          setSelectedSeatId(Number(nextSeats[0].id));
          setSelectedSeatNumber(nextSeats[0].number);
          persistSelectedSeat(nextSeats[0].id, nextSeats[0].number);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      }
    }

    loadSeats();

    return () => {
      ignore = true;
    };
  }, [apiBaseUrl, setErrorMessage]);

  function handleSeatChange(nextSeatId) {
    const seat = seats.find((item) => Number(item.id) === Number(nextSeatId));
    const nextSeatNumber = seat?.number ?? '-';

    setSelectedSeatId(nextSeatId);
    setSelectedSeatNumber(nextSeatNumber);
    persistSelectedSeat(nextSeatId, nextSeatNumber);
    setErrorMessage('');
  }

  return {
    seats,
    seatId: selectedSeatId,
    seatNumber: selectedSeatNumber ?? '-',
    handleSeatChange,
  };
}
