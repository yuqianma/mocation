import { request } from '@/services/request';

export function login(data) {
  return request('/login', {
    method: 'POST',
    data,
  });
}
