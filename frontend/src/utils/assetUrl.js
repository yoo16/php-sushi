export function buildAssetUrl(baseUrl, path) {
  return `${String(baseUrl ?? '/').replace(/\/$/, '')}/${String(path ?? '').replace(/^\//, '')}`;
}
