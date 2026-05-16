import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/app.css';

const rootElement = document.getElementById('menu-app');

if (!rootElement) {
  throw new Error('Missing #menu-app mount element');
}

const dataConfig = JSON.parse(rootElement.dataset.config ?? '{}');
const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? dataConfig.apiBaseUrl ?? '/api/',
  assetBaseUrl: import.meta.env.VITE_ASSET_BASE_URL ?? dataConfig.assetBaseUrl ?? '/',
  ...dataConfig,
};

createRoot(rootElement).render(
  <StrictMode>
    <App config={config} />
  </StrictMode>
);
