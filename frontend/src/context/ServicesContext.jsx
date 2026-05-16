import { createContext, useContext } from 'react';

const ServicesContext = createContext(null);

export function ServicesProvider({ children, value }) {
  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

export function useServices() {
  const value = useContext(ServicesContext);

  if (!value) {
    throw new Error('useServices must be used within ServicesProvider');
  }

  return value;
}
