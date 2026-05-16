import { buildApiUrl } from '../config/runtimeConfig';

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') ?? '';
  const payload = await response.json().catch(() => ({}));

  if (!contentType.includes('application/json')) {
    throw new Error(`API did not return JSON: ${String(url)}`);
  }

  if (!response.ok) {
    throw new Error(payload.error ?? payload.message ?? 'API request failed');
  }

  return payload;
}

export const apiClient = {
  get(path, query, options = {}) {
    const url = buildApiUrl(path, query);
    return requestJson(url, options);
  },

  post(path, body, options = {}) {
    return requestJson(buildApiUrl(path), {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },
};
