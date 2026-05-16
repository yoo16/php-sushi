import { resolveSeatSelection } from '../domain/seat';

export function createSeatService(apiClient) {
  return {
    async loadSeats(selectedSeatId, selectedSeatNumber, options = {}) {
      const seatsResponse = await apiClient.get('seat/fetch.php', undefined, options);
      const seats = seatsResponse.seats ?? [];
      const selectedSeat = resolveSeatSelection(seats, selectedSeatId, selectedSeatNumber);

      return {
        seats,
        selectedSeat,
      };
    },
  };
}
