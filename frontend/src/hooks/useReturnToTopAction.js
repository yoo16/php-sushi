export default function useReturnToTopAction({ session, messages }) {
  function returnToTopScreen() {
    session.setCompletedTotal(0);
    messages.setFlashMessage('');
    messages.setErrorMessage('');
    session.setScreen('start');
  }

  return {
    returnToTopScreen,
  };
}
