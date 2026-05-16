import { useEffect, useState } from 'react';
import { findSeatById } from '../domain/seat';
import { getInitialSeatId, getInitialSeatNumber, persistSelectedSeat } from '../utils/orderSessionStorage';

export default function useSeatSelection({ config, seatService, setErrorMessage }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeatId, setSelectedSeatId] = useState(() => getInitialSeatId(config));
  const [selectedSeatNumber, setSelectedSeatNumber] = useState(() => getInitialSeatNumber(config));

  useEffect(() => {
    let ignore = false;

    async function loadSeatOptions() {
      try {
        const seatData = await seatService.loadSeats(selectedSeatId, selectedSeatNumber);
        if (ignore) {
          return;
        }

        setSeats(seatData.seats);
        setSelectedSeatId(seatData.selectedSeat.seatId);
        setSelectedSeatNumber(seatData.selectedSeat.seatNumber);

        if (seatData.selectedSeat.shouldPersist) {
          persistSelectedSeat(seatData.selectedSeat.seatId, seatData.selectedSeat.seatNumber);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      }
    }

    loadSeatOptions();

    return () => {
      ignore = true;
    };
  }, [seatService, setErrorMessage]);

  function handleSeatChange(nextSeatId) {
    const seat = findSeatById(seats, nextSeatId);
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
