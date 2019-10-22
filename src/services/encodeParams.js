export function encodeParams(params) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`).join('&');
}