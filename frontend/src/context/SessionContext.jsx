import { createContext, useContext } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children, value }) {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useOrderSessionContext() {
  const value = useContext(SessionContext);

  if (!value) {
    throw new Error('useOrderSessionContext must be used within SessionProvider');
  }

  return value;
}
