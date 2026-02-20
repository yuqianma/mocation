import * as turf from '@turf/turf';

function pointTimestamp(point) {
  return point.createdAt || point.time;
}

export function filterAbnormal(points) {
  if (!Array.isArray(points) || points.length <= 2) {
    return points || [];
  }

  let previous = null;

  return points.filter((point, index) => {
    if (index === 0) {
      previous = point;
      return true;
    }

    const dis = turf.distance(
      turf.point([previous.latlng.longitude, previous.latlng.latitude]),
      turf.point([point.latlng.longitude, point.latlng.latitude])
    );

    const currentTime = new Date(pointTimestamp(point));
    const previousTime = new Date(pointTimestamp(previous));
    const duration = (currentTime - previousTime) / 1000 / 3600;

    const speed = duration > 0 ? dis / duration : Number.POSITIVE_INFINITY;

    if (speed > 1000) {
      return false;
    }

    previous = point;
    return true;
  });
}
