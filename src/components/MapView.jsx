import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { cn } from '@/lib/utils';
import { appEnv } from '@/lib/env';
import { useApp } from '@/context/AppContext';

const LINE_SOURCE_ID = 'line';
const POINTS_SOURCE_ID = 'points';

const EMPTY_LINE_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

const EMPTY_POINTS = {
  type: 'FeatureCollection',
  features: [],
};

const OSM_FALLBACK_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};

function ensureMapLayers(map) {
  if (!map.getSource(LINE_SOURCE_ID)) {
    map.addSource(LINE_SOURCE_ID, {
      type: 'geojson',
      lineMetrics: true,
      data: EMPTY_LINE_COLLECTION,
    });
  }

  if (!map.getSource(POINTS_SOURCE_ID)) {
    map.addSource(POINTS_SOURCE_ID, {
      type: 'geojson',
      data: EMPTY_POINTS,
    });
  }

  if (!map.getLayer(LINE_SOURCE_ID)) {
    map.addLayer({
      id: LINE_SOURCE_ID,
      type: 'line',
      source: LINE_SOURCE_ID,
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
  }

  if (!map.getLayer(POINTS_SOURCE_ID)) {
    map.addLayer({
      id: POINTS_SOURCE_ID,
      type: 'circle',
      source: POINTS_SOURCE_ID,
      paint: {
        'circle-radius': 2,
        'circle-color': 'red',
      },
    });
  }
}

function isDegenerateBounds(minX, minY, maxX, maxY) {
  return Math.abs(minX - maxX) < 1e-9 && Math.abs(minY - maxY) < 1e-9;
}

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
  const fallbackAppliedRef = useRef(false);
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
    if (mapRef.current || !mapContainerRef.current) {
      return;
    }

    const hasMapboxToken = Boolean(appEnv.mapboxAccessToken);
    if (hasMapboxToken) {
      mapboxgl.accessToken = appEnv.mapboxAccessToken;
    }

    if (!hasMapboxToken) {
      setErrorMsg({ error: 'No VITE_MAPBOX_ACCESS_TOKEN found. Using OSM fallback map.' });
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: hasMapboxToken ? 'mapbox://styles/mapbox/light-v10' : OSM_FALLBACK_STYLE,
      center: [0, 0],
      zoom: 1,
    });

    mapRef.current = map;

    const onLoad = () => {
      ensureMapLayers(map);
      map.resize();
      setIsMapReady(true);
    };

    const onStyleLoad = () => {
      ensureMapLayers(map);
    };

    map.on('load', onLoad);
    map.on('style.load', onStyleLoad);
    map.on('error', (event) => {
      const message = event?.error?.message || '';

      if (!fallbackAppliedRef.current && /403|401|forbidden|unauthorized/i.test(message)) {
        fallbackAppliedRef.current = true;
        map.setStyle(OSM_FALLBACK_STYLE);
        setErrorMsg({ error: 'Mapbox token rejected (403). Switched to OSM fallback map.' });
        return;
      }

      if (message) {
        setErrorMsg({ error: message });
      }
    });

    return () => {
      setIsMapReady(false);
      map.off('load', onLoad);
      map.off('style.load', onStyleLoad);
      map.remove();
      mapRef.current = null;
    };
  }, [setErrorMsg]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current) {
      return;
    }

    const map = mapRef.current;
    const lineSource = map.getSource(LINE_SOURCE_ID);
    const pointsSource = map.getSource(POINTS_SOURCE_ID);

    if (!lineSource || !pointsSource || typeof lineSource.setData !== 'function' || typeof pointsSource.setData !== 'function') {
      return;
    }

    lineSource.setData(line);
    pointsSource.setData(points);

    if (lineFeature) {
      const [minX, minY, maxX, maxY] = turf.bbox(lineFeature);
      if (isDegenerateBounds(minX, minY, maxX, maxY)) {
        map.flyTo({
          center: coordinates[coordinates.length - 1],
          zoom: 14,
          essential: true,
        });
        return;
      }

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
