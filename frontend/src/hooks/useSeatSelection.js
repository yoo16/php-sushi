import { useEffect, useState } from 'react';
import { findSeatById, loadSeats } from '../services/seatService';
import { getInitialSeatId, getInitialSeatNumber, persistSelectedSeat } from '../utils/orderSessionStorage';

export default function useSeatSelection({ config, setErrorMessage }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeatId, setSelectedSeatId] = useState(() => getInitialSeatId(config));
  const [selectedSeatNumber, setSelectedSeatNumber] = useState(() => getInitialSeatNumber(config));

  useEffect(() => {
    const controller = new AbortController();

    async function loadSeatOptions() {
      try {
        const seatData = await loadSeats(selectedSeatId, selectedSeatNumber, {
          signal: controller.signal,
        });

        setSeats(seatData.seats);
        setSelectedSeatId(seatData.selectedSeat.seatId);
        setSelectedSeatNumber(seatData.selectedSeat.seatNumber);

        if (seatData.selectedSeat.shouldPersist) {
          persistSelectedSeat(seatData.selectedSeat.seatId, seatData.selectedSeat.seatNumber);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message);
        }
      }
    }

    loadSeatOptions();

    return () => { controller.abort(); };
  }, [setErrorMessage]);

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
