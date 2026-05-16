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
