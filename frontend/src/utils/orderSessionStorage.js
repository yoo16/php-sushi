export function getInitialSeatId(config) {
  if (typeof window === 'undefined') {
    return Number(config.seatId ?? 0);
  }

  const storedSeatId = Number(window.localStorage.getItem('selectedSeatId') ?? 0);
  return storedSeatId > 0 ? storedSeatId : Number(config.seatId ?? 0);
}

export function getInitialSeatNumber(config) {
  if (typeof window === 'undefined') {
    return config.seatNumber ?? '-';
  }

  return window.localStorage.getItem('selectedSeatNumber') ?? config.seatNumber ?? '-';
}

export function persistSelectedSeat(seatId, seatNumber) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem('selectedSeatId', String(seatId));
  window.localStorage.setItem('selectedSeatNumber', String(seatNumber));
}

export function getStoredOrderSession() {
  if (typeof window === 'undefined') {
    return {
      visitId: 0,
      screen: 'start',
      completedTotal: 0,
    };
  }

  return {
    visitId: Number(window.localStorage.getItem('activeVisitId') ?? 0),
    screen: window.localStorage.getItem('orderScreen') ?? 'start',
    completedTotal: Number(window.localStorage.getItem('completedTotal') ?? 0),
  };
}

export function persistOrderSession({ visitId, screen, completedTotal }) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem('activeVisitId', String(visitId ?? 0));
  window.localStorage.setItem('orderScreen', String(screen ?? 'start'));
  window.localStorage.setItem('completedTotal', String(completedTotal ?? 0));
}

export function clearStoredOrderSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem('activeVisitId');
  window.localStorage.removeItem('orderScreen');
  window.localStorage.removeItem('completedTotal');
}
