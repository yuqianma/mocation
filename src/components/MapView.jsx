import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { cn } from '@/lib/utils';
import { appEnv } from '@/lib/env';
import { useApp } from '@/context/AppContext';

const EMPTY_LINE_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

const EMPTY_POINTS = {
  type: 'FeatureCollection',
  features: [],
};

function normalizePoints(results) {
  return results
    .map((point) => {
      const lon = Number(point?.latlng?.longitude);
      const lat = Number(point?.latlng?.latitude);
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
        return null;
      }
      return {
        coord: [lon, lat],
        data: point,
      };
    })
    .filter(Boolean);
}

export default function MapView({ blur, results }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const { setErrorMsg } = useApp();

  const mapPoints = useMemo(() => normalizePoints(results), [results]);

  const coordinates = useMemo(() => mapPoints.map((point) => point.coord), [mapPoints]);

  const lineFeature = useMemo(() => (coordinates.length >= 2 ? turf.lineString(coordinates) : null), [coordinates]);

  const line = useMemo(
    () => (lineFeature ? turf.featureCollection([lineFeature]) : EMPTY_LINE_COLLECTION),
    [lineFeature]
  );

  const points = useMemo(
    () =>
      turf.featureCollection(
        mapPoints.map((point) => {
          return turf.point(point.coord, point.data);
        })
      ),
    [mapPoints]
  );

  useEffect(() => {
    if (mapRef.current) {
      return;
    }

    if (!appEnv.mapboxAccessToken) {
      setErrorMsg({ error: 'Missing Mapbox token: set VITE_MAPBOX_ACCESS_TOKEN or VUE_APP_MAPBOX_ACCESS_TOKEN.' });
      return;
    }

    mapboxgl.accessToken = appEnv.mapboxAccessToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v10',
    });

    mapRef.current = map;

    map.on('load', () => {
      map.addSource('line', {
        type: 'geojson',
        lineMetrics: true,
        data: EMPTY_LINE_COLLECTION,
      });

      map.addSource('points', {
        type: 'geojson',
        data: EMPTY_POINTS,
      });

      map.addLayer({
        id: 'line',
        type: 'line',
        source: 'line',
        paint: {
          'line-color': 'red',
          'line-width': 5,
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            'blue',
            0.1,
            'royalblue',
            0.3,
            'cyan',
            0.5,
            'lime',
            0.7,
            'yellow',
            1,
            'red',
          ],
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
      });

      map.addLayer({
        id: 'points',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 2,
          'circle-color': 'red',
        },
      });

      setIsMapReady(true);
    });

    map.on('error', (event) => {
      if (event?.error?.message) {
        setErrorMsg({ error: event.error.message });
      }
    });

    return () => {
      setIsMapReady(false);
      map.remove();
      mapRef.current = null;
    };
  }, [setErrorMsg]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current) {
      return;
    }

    const map = mapRef.current;
    const lineSource = map.getSource('line');
    const pointsSource = map.getSource('points');

    if (!lineSource || !pointsSource) {
      return;
    }

    lineSource.setData(line);
    pointsSource.setData(points);

    if (lineFeature) {
      const [minX, minY, maxX, maxY] = turf.bbox(lineFeature);
      map.fitBounds(
        [
          [minX, minY],
          [maxX, maxY],
        ],
        {
          padding: 20,
          maxZoom: 15,
          animate: false,
        }
      );
      return;
    }

    if (coordinates.length === 1) {
      map.flyTo({
        center: coordinates[0],
        zoom: 14,
        essential: true,
      });
    }
  }, [coordinates, isMapReady, line, lineFeature, points]);

  return (
    <div
      ref={mapContainerRef}
      className={cn(
        'absolute inset-0 h-full w-full transition-[filter] duration-300',
        blur ? 'blur-[2px]' : 'blur-0'
      )}
    />
  );
}
