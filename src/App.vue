<template>
  <v-app id="app">
    <Map />
    <Picker />
  </v-app>
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
</style>

<script>
import Map from './components/Map';
import Picker from './components/Picker';

export default {
  components: {
    Map,
    Picker
  }
}
</script>
