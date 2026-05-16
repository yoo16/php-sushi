import { apiClient } from './api';

export function findVisitById(visitId, options = {}) {
  return apiClient.get('visit/find.php', { id: String(visitId) }, options);
}

export function joinVisit(seatId, options = {}) {
  return apiClient.post('visit/join.php', { seat_id: seatId }, options);
}
