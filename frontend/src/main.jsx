import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppConfigProvider } from './context/AppConfigContext';
import { getRouterBasename, setRuntimeConfig } from './config/runtimeConfig';
import './styles/app.css';

const rootElement = document.getElementById('menu-app');

if (!rootElement) {
  throw new Error('Missing #menu-app mount element');
}

const dataConfig = JSON.parse(rootElement.dataset.config ?? '{}');

function resolveConfigValue(primaryValue, fallbackValue) {
  const value = primaryValue ?? fallbackValue;

  if (typeof value === 'string' && /^%VITE_[A-Z0-9_]+%$/.test(value)) {
    return fallbackValue;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return fallbackValue;
  }

  return value;
}

const config = {
  ...dataConfig,
  baseUrl: resolveConfigValue(import.meta.env.VITE_APP_BASE_URL, dataConfig.baseUrl ?? '/'),
  apiBaseUrl: resolveConfigValue(import.meta.env.VITE_API_BASE_URL, dataConfig.apiBaseUrl ?? '/api/'),
  assetBaseUrl: resolveConfigValue(import.meta.env.VITE_ASSET_BASE_URL, dataConfig.assetBaseUrl ?? '/'),
};

config.baseUrl = resolveConfigValue(config.baseUrl, '/');
config.apiBaseUrl = resolveConfigValue(config.apiBaseUrl, '/api/');
config.assetBaseUrl = resolveConfigValue(config.assetBaseUrl, '/');

setRuntimeConfig(config);

createRoot(rootElement).render(
  <StrictMode>
    <AppConfigProvider config={config}>
      <BrowserRouter basename={getRouterBasename()}>
        <App />
      </BrowserRouter>
    </AppConfigProvider>
  </StrictMode>
);
