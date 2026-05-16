import { resolveSeatSelection } from '../domain/seat';

export function createSeatService(apiClient) {
  return {
    async loadSeats(selectedSeatId, selectedSeatNumber) {
      const seatsResponse = await apiClient.get('seat/fetch.php');
      const seats = seatsResponse.seats ?? [];
      const selectedSeat = resolveSeatSelection(seats, selectedSeatId, selectedSeatNumber);

      return {
        seats,
        selectedSeat,
      };
    },
  };
}
