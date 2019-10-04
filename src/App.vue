<template>
  <div id="app">
    <div id="map"></div>
  </div>
</template>

<style>
html, body {
  height: 100%;
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

#map {
  height: 100%;
  background: #ccc;
}
</style>

<script>
import { fetchPoints } from './util';
import * as turf from '@turf/turf'

export default {
  beforeCreate: function () {
    fetchPoints().then(({ results }) => {
      if (results.length > 1000) {
        console.error('too many points:', results);
      }
      const line = turf.lineString(
        results.map(({ latlng }) => ([latlng.longitude, latlng.latitude]))
      );
      const bbox = turf.bbox(line);
      this.initMap([bbox.slice(0, 2), bbox.slice(2)], line);
    });
  },
  methods: {
    initMap(bounds, geojson) {
      /* global mapboxgl */
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        // hash: true,
      });
      map.fitBounds(bounds, {
        padding: 20,
        maxZoom: 15,
        animate: false
      });

      map.on('load', () => {
        // https://docs.mapbox.com/mapbox-gl-js/example/line-gradient/

        map.addSource('line', {
          type: 'geojson',
          lineMetrics: true,
          data: geojson
        });

        map.addLayer({
          type: 'line',
          source: 'line',
          id: 'line',
          paint: {
            'line-color': 'red',
            'line-width': 5,
            // 'line-gradient' must be specified using an expression
            // with the special 'line-progress' property
            'line-gradient': [
              'interpolate',
              ['linear'],
              ['line-progress'],
              0, "blue",
              0.1, "royalblue",
              0.3, "cyan",
              0.5, "lime",
              0.7, "yellow",
              1, "red"
            ]
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          }
        });
      });

      
    }
  }
}
</script>
