import { useState } from 'react';

export default function useMessageState() {
  const [errorMessage, setErrorMessage] = useState('');
  const [flashMessage, setFlashMessage] = useState('');

  return {
    errorMessage,
    flashMessage,
    setErrorMessage,
    setFlashMessage,
  };
}
