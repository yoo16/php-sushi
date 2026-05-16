import { createContext, useContext } from 'react';

const MessagesContext = createContext(null);

export function MessagesProvider({ children, value }) {
  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  const value = useContext(MessagesContext);

  if (!value) {
    throw new Error('useMessages must be used within MessagesProvider');
  }

  return value;
}
