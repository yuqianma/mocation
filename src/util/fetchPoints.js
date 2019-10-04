import { encodeParams } from './encodeParams';

const URL = 'http://mocation.hcifun.com/1.1/classes/Point';

export function fetchPoints (from, to = new Date()) {
  from = from || (to - 86400e3);

  const params = {
    where: {
      time: {
        $gte: {
          __type: 'Date',
          iso: new Date(from).toISOString()
        },
        $lte: {
          __type: 'Date',
          iso: new Date(to).toISOString()
        }
      }
    },
    keys: 'latlng,time,s',
    order: 'time',
    limit: 1000
  };

  return fetch(`${URL}?${encodeParams(params)}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-LC-Id': 'XHtq6Obuh8H3cRMECcVdoDT3-gzGzoHsz',
      'X-LC-Key': 'r4wDxAEdcwRyC7RF0Y5KsyTt'
    },
    method: 'GET',
    mode: 'cors'
  })
  .then(r => r.json())
  .catch(error => console.error('Error:', error));
}
