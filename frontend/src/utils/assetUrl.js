const DEFAULT_ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? '/';

export function buildAssetUrl(baseUrl, path) {
  const resolvedBaseUrl = typeof baseUrl === 'string' && baseUrl.trim() !== ''
    ? baseUrl
    : DEFAULT_ASSET_BASE_URL;

  return `${String(resolvedBaseUrl).replace(/\/$/, '')}/${String(path ?? '').replace(/^\//, '')}`;
}
