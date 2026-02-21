const env = import.meta.env;

function readEnv(key) {
  const value = env[key];
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return '';
}

export const appEnv = {
  lcId: readEnv('VITE_LC_ID'),
  lcKey: readEnv('VITE_LC_KEY'),
  apiBaseUrl: readEnv('VITE_API_BASE_URL'),
  mapboxAccessToken: readEnv('VITE_MAPBOX_ACCESS_TOKEN'),
  devUsername: readEnv('VITE_DEV_USERNAME'),
  devPassword: readEnv('VITE_DEV_PASSWORD'),
};
