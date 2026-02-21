import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { cn } from '@/lib/utils';
import { appEnv } from '@/lib/env';
import { useApp } from '@/context/AppContext';

const LINE_SOURCE_ID = 'line';
const POINTS_SOURCE_ID = 'points';
const SELECTED_POINT_SOURCE_ID = 'selected-point';

const EMPTY_LINE_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

const EMPTY_POINTS = {
  type: 'FeatureCollection',
  features: [],
};

const EMPTY_SELECTED_POINTS = {
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

  if (!map.getSource(SELECTED_POINT_SOURCE_ID)) {
    map.addSource(SELECTED_POINT_SOURCE_ID, {
      type: 'geojson',
      data: EMPTY_SELECTED_POINTS,
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
        'circle-radius': 3,
        'circle-color': 'red',
      },
    });
  }

  if (!map.getLayer(SELECTED_POINT_SOURCE_ID)) {
    map.addLayer({
      id: SELECTED_POINT_SOURCE_ID,
      type: 'circle',
      source: SELECTED_POINT_SOURCE_ID,
      paint: {
        'circle-radius': 8,
        'circle-color': '#ffffff',
        'circle-stroke-color': '#dc2626',
        'circle-stroke-width': 3,
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
      const timestamp =
        (typeof point?.time === 'string' && point.time) ||
        (typeof point?.time?.iso === 'string' && point.time.iso) ||
        (typeof point?.createdAt === 'string' && point.createdAt) ||
        '';
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
        return null;
      }
      return {
        coord: [lon, lat],
        timestamp,
      };
    })
    .filter(Boolean);
}

export default function MapView({ blur, results }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const fallbackAppliedRef = useRef(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const { setErrorMsg, setSelectedPointTimestamp } = useApp();

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
          return turf.point(point.coord, {
            timestamp: point.timestamp,
          });
        })
      ),
    [mapPoints]
  );

  const selectedPoints = useMemo(
    () =>
      selectedPoint
        ? turf.featureCollection([
            turf.point(selectedPoint.coord, {
              timestamp: selectedPoint.timestamp,
            }),
          ])
        : EMPTY_SELECTED_POINTS,
    [selectedPoint]
  );

  useEffect(() => {
    setSelectedPoint(null);
    setSelectedPointTimestamp('');
  }, [mapPoints, setSelectedPointTimestamp]);

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
    const onPointClick = (event) => {
      const feature = event?.features?.[0];
      const coordinates = feature?.geometry?.coordinates;
      if (!Array.isArray(coordinates) || coordinates.length < 2) {
        return;
      }

      const lon = Number(coordinates[0]);
      const lat = Number(coordinates[1]);
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
        return;
      }

      const timestamp = typeof feature?.properties?.timestamp === 'string' ? feature.properties.timestamp : '';
      setSelectedPoint({
        coord: [lon, lat],
        timestamp,
      });
      setSelectedPointTimestamp(timestamp);
    };

    const onPointMouseEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };

    const onPointMouseLeave = () => {
      map.getCanvas().style.cursor = '';
    };

    map.on('click', POINTS_SOURCE_ID, onPointClick);
    map.on('mouseenter', POINTS_SOURCE_ID, onPointMouseEnter);
    map.on('mouseleave', POINTS_SOURCE_ID, onPointMouseLeave);

    return () => {
      map.off('click', POINTS_SOURCE_ID, onPointClick);
      map.off('mouseenter', POINTS_SOURCE_ID, onPointMouseEnter);
      map.off('mouseleave', POINTS_SOURCE_ID, onPointMouseLeave);
      map.getCanvas().style.cursor = '';
    };
  }, [isMapReady, setSelectedPointTimestamp]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current) {
      return;
    }

    const map = mapRef.current;
    const lineSource = map.getSource(LINE_SOURCE_ID);
    const pointsSource = map.getSource(POINTS_SOURCE_ID);
    const selectedPointsSource = map.getSource(SELECTED_POINT_SOURCE_ID);

    if (
      !lineSource ||
      !pointsSource ||
      !selectedPointsSource ||
      typeof lineSource.setData !== 'function' ||
      typeof pointsSource.setData !== 'function' ||
      typeof selectedPointsSource.setData !== 'function'
    ) {
      return;
    }

    lineSource.setData(line);
    pointsSource.setData(points);
    selectedPointsSource.setData(selectedPoints);

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
  }, [coordinates, isMapReady, line, lineFeature, points, selectedPoints]);

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
