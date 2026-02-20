export function encodeParams(params) {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(typeof value === 'object' ? JSON.stringify(value) : value)}`)
    .join('&');
}
