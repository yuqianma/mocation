import { request } from './request';
import { encodeParams } from './encodeParams';

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

  return request(`/classes/Point?${encodeParams(params)}`)
}
