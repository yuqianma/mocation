import { request } from './request';
import { encodeParams } from './encodeParams';
import { filterAbnormal } from '../filterAbnormal';

export async function fetchPoints (from, to = new Date()) {
  from = from || (to - 86400e3);

  const params = {
    where: {
      time: {
        // $gte: {
        //   __type: 'Date',
        //   iso: new Date(from).toISOString()
        // },
        $lte: {
          __type: 'Date',
          iso: new Date(to).toISOString()
        }
      }
    },
    keys: 'latlng,time,s',
    order: '-time',
    limit: 1000
  };

  const res = await request(`/classes/Point?${encodeParams(params)}`);
  if (!(res && Array.isArray(res.results))) {
    return [];
  }
  let { results } = res;
  results = results.reverse();
  results = Object.freeze(filterAbnormal(results));
  return results;
}
