const DEFAULT_CONFIG = {
  baseUrl: import.meta.env.VITE_APP_BASE_URL ?? '/',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api/',
  assetBaseUrl: import.meta.env.VITE_ASSET_BASE_URL ?? '/',
};

let runtimeConfig = { ...DEFAULT_CONFIG };

export function setRuntimeConfig(config = {}) {
  runtimeConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };
}

export function getRuntimeConfig() {
  return runtimeConfig;
}

export function normalizeBasePath(path) {
  const value = String(path ?? '/').trim();

  if (!value || value === '/') {
    return '/';
  }

  return `/${value.replace(/^\/+|\/+$/g, '')}/`;
}

export function getRouterBasename() {
  const normalized = normalizeBasePath(runtimeConfig.baseUrl);

  if (normalized === '/') {
    return '/';
  }

  return normalized.replace(/\/$/, '');
}

export function buildApiUrl(path, query) {
  const base = new URL(runtimeConfig.apiBaseUrl ?? DEFAULT_CONFIG.apiBaseUrl, window.location.origin);
  const url = new URL(String(path ?? '').replace(/^\//, ''), base);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url;
}
