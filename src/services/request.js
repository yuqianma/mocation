import { appEnv } from '@/lib/env';

function ensureBaseUrl() {
  if (!appEnv.apiBaseUrl) {
    throw { error: 'Missing API base URL env var (VITE_API_BASE_URL or VUE_APP_API_BASE_URL).' };
  }
}

export async function request(url, options = {}) {
  ensureBaseUrl();

  const { data, headers, sessionToken, ...rest } = options;
  const requestHeaders = {
    'Content-Type': 'application/json',
    'X-LC-Id': appEnv.lcId,
    'X-LC-Key': appEnv.lcKey,
    ...headers,
  };

  if (sessionToken) {
    requestHeaders['X-LC-Session'] = sessionToken;
  }

  const requestInit = {
    ...rest,
    headers: requestHeaders,
  };

  if (data !== undefined) {
    requestInit.body = JSON.stringify(data);
  }

  const response = await fetch(`${appEnv.apiBaseUrl}${url}`, requestInit);
  const json = await response.json().catch(() => ({ error: 'Invalid JSON response from server.' }));

  if (!response.ok) {
    throw json;
  }

  return json;
}
