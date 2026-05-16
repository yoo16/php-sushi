import { createContext, useContext } from 'react';

const AppConfigContext = createContext(null);

export function AppConfigProvider({ children, config }) {
  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  const config = useContext(AppConfigContext);

  if (!config) {
    throw new Error('useAppConfig must be used within AppConfigProvider');
  }

  return config;
}
