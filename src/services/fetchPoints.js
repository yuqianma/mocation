import { encodeParams } from '@/services/encodeParams';
import { filterAbnormal } from '@/filterAbnormal';
import { request } from '@/services/request';

export async function fetchPoints(from, to = new Date(), sessionToken) {
  const toDate = new Date(to);
  const fromDate = from ? new Date(from) : new Date(toDate.getTime() - 86400e3);

  const params = {
    where: {
      time: {
        $gte: {
          __type: 'Date',
          iso: fromDate.toISOString(),
        },
        $lte: {
          __type: 'Date',
          iso: toDate.toISOString(),
        },
      },
    },
    keys: 'latlng,time,s,createdAt',
    order: '-time',
    limit: 1000,
  };

  const response = await request(`/classes/Point?${encodeParams(params)}`, { sessionToken });

  if (!(response && Array.isArray(response.results))) {
    return [];
  }

  const results = response.results.slice().reverse();
  return Object.freeze(filterAbnormal(results));
}
