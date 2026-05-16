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
