import { createContext, useContext } from 'react';

const OrderAppContext = createContext(null);

export function OrderAppProvider({ children, value }) {
  return (
    <OrderAppContext.Provider value={value}>
      {children}
    </OrderAppContext.Provider>
  );
}

export function useOrderApp() {
  const value = useContext(OrderAppContext);

  if (!value) {
    throw new Error('useOrderApp must be used within OrderAppProvider');
  }

  return value;
}
