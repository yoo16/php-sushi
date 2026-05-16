import { createContext, useContext } from 'react';

const SeatContext = createContext(null);

export function SeatProvider({ children, value }) {
  return (
    <SeatContext.Provider value={value}>
      {children}
    </SeatContext.Provider>
  );
}

export function useSeat() {
  const value = useContext(SeatContext);

  if (!value) {
    throw new Error('useSeat must be used within SeatProvider');
  }

  return value;
}
