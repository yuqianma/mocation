<template>
  <v-app id="app">
    <router-view name="map"></router-view>
    <router-view name="picker"></router-view>
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
