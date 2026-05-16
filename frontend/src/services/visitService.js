export function createVisitService(apiClient) {
  return {
    findVisitById(visitId) {
      return apiClient.get('visit/find.php', {
        id: String(visitId),
      });
    },

    joinVisit(seatId) {
      return apiClient.post('visit/join.php', {
        seat_id: seatId,
      });
    },
  };
}
