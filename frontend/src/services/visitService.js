export function createVisitService(apiClient) {
  return {
    findVisitById(visitId, options = {}) {
      return apiClient.get('visit/find.php', {
        id: String(visitId),
      }, options);
    },

    joinVisit(seatId, options = {}) {
      return apiClient.post('visit/join.php', {
        seat_id: seatId,
      }, options);
    },
  };
}
