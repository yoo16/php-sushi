import { apiClient } from './api';

export function findVisitById(visitId, options = {}) {
  return apiClient.get('visit/find', { id: String(visitId) }, options);
}

export function joinVisit(seatId, options = {}) {
  return apiClient.post('visit/join', { seat_id: seatId }, options);
}
