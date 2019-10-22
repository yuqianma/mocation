import { request } from './request';

export function login(data) {
  return request('/login', {
    method: 'POST',
    data,
  });
}

