async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error ?? payload.message ?? 'API request failed');
  }

  return payload;
}

export function createApiClient(baseUrl) {
  return {
    get(path, query, options = {}) {
      const url = new URL(buildApiUrl(baseUrl, path), window.location.origin);

      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, String(value));
          }
        });
      }

      return requestJson(url, options);
    },

    post(path, body, options = {}) {
      return requestJson(buildApiUrl(baseUrl, path), {
        ...options,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    },
  };
}

function buildApiUrl(baseUrl, path) {
  const normalizedBase = `${String(baseUrl ?? '').replace(/\/$/, '')}/`;

  if (/^https?:\/\//.test(normalizedBase)) {
    return new URL(path, normalizedBase).toString();
  }

  if (normalizedBase.endsWith('/api/')) {
    return `${normalizedBase}${path}`;
  }

  return `${normalizedBase}api/${path}`;
}
