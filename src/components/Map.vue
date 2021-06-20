<template>
  <div ref="map" :class="blur ? 'blur' : 'no-blur'"></div>
</template>

<style scoped>
div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #ccc;
  transition: filter 0.3s;
}
.blur {
  filter: blur(2px);
}
.no-blur {
  filter: blur(0);
}
</style>

<script>
import * as turf from '@turf/turf';
import { mapState } from 'vuex';

export default {
  name: 'Map',
  beforeCreate () {
    this.$store.dispatch('fetchPoints');
  },
  mounted () {
    /* global mapboxgl */
    const map = this.map = new mapboxgl.Map({
      container: this.$refs.map,
      style: 'mapbox://styles/mapbox/light-v10',
      // hash: true,
    });

    window._map = map;

    map.on('load', () => {
        // https://docs.mapbox.com/mapbox-gl-js/example/line-gradient/

      map.addSource('line', {
        type: 'geojson',
        lineMetrics: true,
        data: {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": []
          }
        }
      });

      map.addSource('points', {
        type: 'geojson',
        data: null
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

      map.addLayer({
        type: 'circle',
        source: 'points',
        id: 'points',
        'paint': {
          'circle-radius': 2,
          'circle-color': 'red'
        },
      });

      map.on('click', function (e) {
        const delta = 1e-50;
        // set bbox as 5px reactangle area around clicked point
        var bbox = [
          [e.point.x - delta, e.point.y - delta],
          [e.point.x + delta, e.point.y + delta]
        ];
        var features = map.queryRenderedFeatures(bbox, {
          layers: ['points']
        });
        console.log(features);

        // map.getSource('points').setData(features[0]);
      });

    });
  },
  computed: {
    ...mapState(['blur']),
    line() {
      const results = this.$store.state.results;
      if (results.length) {
        return turf.lineString(
          results.map(({ latlng }) => ([latlng.longitude, latlng.latitude]))
        )
      }
      return null;
    },
    points() {
      const results = this.$store.state.results;
      if (results.length) {
        return turf.featureCollection(
          results.map((p) => {
            console.log(p);
            return turf.point([p.latlng.longitude, p.latlng.latitude], p);
          })
        );
      }
      return null;
    },
    bounds() {
      if (!this.line) {
        return;
      }
      const bbox = turf.bbox(this.line);
      return [bbox.slice(0, 2), bbox.slice(2)];
    }
  },
  watch: {
    bounds (bounds) {
      bounds && bounds.length && this.updateMap(bounds, this.line, this.points);
    }
  },
  methods: {
    updateMap(bounds, line, points) {
      console.log(points);
      const map = this.map;
      map.fitBounds(bounds, {
        padding: 20,
        maxZoom: 15,
        animate: false
      });

      const lineSource = map.getSource('line');
      const pointsSource = map.getSource('points');

      if (lineSource) {
        lineSource.setData(line);
        pointsSource.setData(points);
      } else {
        map.on('load', () => {
          map.getSource('line').setData(line);
          map.getSource('points').setData(points);
        });
      }

    }
  }
}
</script>
