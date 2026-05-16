export async function ensureVisitSession(apiBaseUrl, seatId, currentVisitId, { fetchVisit, joinVisit }) {
  if (Number(currentVisitId) > 0) {
    const visitResponse = await fetchVisit(apiBaseUrl, currentVisitId);
    if (visitResponse.status === 'success' && visitResponse.visit) {
      return visitResponse.visit;
    }
  }

  if (Number(seatId) <= 0) {
    return null;
  }

  const joinResponse = await joinVisit(apiBaseUrl, seatId);
  if (joinResponse.status !== 'success' || !joinResponse.visit) {
    return null;
  }

  if (typeof joinResponse.visit === 'object') {
    return joinResponse.visit;
  }

  const resolvedVisitResponse = await fetchVisit(apiBaseUrl, joinResponse.visit);
  if (resolvedVisitResponse.status === 'success' && resolvedVisitResponse.visit) {
    return resolvedVisitResponse.visit;
  }

  return null;
}

export function playThanksVoice() {
  const voiceFiles = [
    '/audio/voice-thanks-1.mp3',
    '/audio/voice-thanks-2.mp3',
    '/audio/voice-thanks-3.mp3',
    '/audio/voice-thanks-4.mp3',
    '/audio/voice-thanks-5.mp3',
  ];
  const selectedFile = voiceFiles[Math.floor(Math.random() * voiceFiles.length)];
  const audio = new Audio(selectedFile);

  audio.play().catch(() => {
    // Ignore autoplay failures; the order itself already succeeded.
  });
}

export function formatPrice(value) {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}
