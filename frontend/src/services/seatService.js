import { apiClient } from './api';

export async function loadSeats(selectedSeatId, selectedSeatNumber, options = {}) {
  const seatsResponse = await apiClient.get('seat/fetch', undefined, options);
  const seats = seatsResponse.seats ?? [];
  const selectedSeat = resolveSeatSelection(seats, selectedSeatId, selectedSeatNumber);
  return { seats, selectedSeat };
}

export function findSeatById(seats, seatId) {
  return seats.find((seat) => Number(seat.id) === Number(seatId)) ?? null;
}

export function resolveSeatSelection(seats, selectedSeatId, fallbackSeatNumber = '-') {
  const matchedSeat = findSeatById(seats, selectedSeatId);

  if (matchedSeat) {
    return {
      seatId: Number(matchedSeat.id),
      seatNumber: matchedSeat.number,
      shouldPersist: false,
    };
  }

  if (seats.length === 1) {
    return {
      seatId: Number(seats[0].id),
      seatNumber: seats[0].number,
      shouldPersist: true,
    };
  }

  return {
    seatId: Number(selectedSeatId ?? 0),
    seatNumber: fallbackSeatNumber,
    shouldPersist: false,
  };
}
