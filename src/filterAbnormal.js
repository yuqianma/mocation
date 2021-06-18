import * as turf from '@turf/turf';

export function filterAbnormal(points) {
	if (points.length <= 2) {
		return points;
	}

	let pre = null;

	return points.filter((p, i) => {
		if (i === 0) {
			pre = p;
			return true;
		}
		
		const dis = turf.distance(
			turf.point([pre.latlng.longitude, pre.latlng.latitude]),
			turf.point([p.latlng.longitude, p.latlng.latitude])
		);

		const duration = (new Date(p.createdAt) - new Date(pre.createdAt)) / 1000 / 3600;

		const speed = dis / duration;

		if (Math.abs(p.latlng.latitude - 25.905162088999376) < 0.01 && Math.abs(p.latlng.longitude - 100.19756589084864) < 0.01) {
			console.warn(p);
		}

		// if (Math.abs(p.latlng.longitude - 100.15) < 0.01) {
		// 	console.log(p);
		// 	return false;
		// }

		if (speed > 1000) {
			console.log(pre, p, speed);
			return false;
		}
		pre = p;
		return true;
	});


}
