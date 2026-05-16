async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error ?? payload.message ?? 'API request failed');
  }

  return payload;
}

export function fetchCategories(baseUrl) {
  return requestJson(buildApiUrl(baseUrl, 'category/fetch.php'));
}

export function fetchProducts(baseUrl, categoryId) {
  const url = new URL(buildApiUrl(baseUrl, 'product/fetch.php'), window.location.origin);

  if (Number(categoryId) > 0) {
    url.searchParams.set('category_id', String(categoryId));
  }

  return requestJson(url);
}

export function fetchOrders(baseUrl, visitId) {
  const url = new URL(buildApiUrl(baseUrl, 'order/fetch.php'), window.location.origin);
  url.searchParams.set('visit_id', String(visitId));
  return requestJson(url);
}

export function fetchVisit(baseUrl, visitId) {
  const url = new URL(buildApiUrl(baseUrl, 'visit/find.php'), window.location.origin);
  url.searchParams.set('id', String(visitId));
  return requestJson(url);
}

export function joinVisit(baseUrl, seatId) {
  return requestJson(buildApiUrl(baseUrl, 'visit/join.php'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      seat_id: seatId,
    }),
  });
}

export function addOrder(baseUrl, payload) {
  return requestJson(buildApiUrl(baseUrl, 'order/add.php'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function billVisit(baseUrl, visitId) {
  const url = new URL(buildApiUrl(baseUrl, 'order/billed.php'), window.location.origin);
  url.searchParams.set('visit_id', String(visitId));
  return requestJson(url);
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
