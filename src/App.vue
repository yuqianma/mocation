<template>
  <v-app id="app" :class="{ blur: blur }">
    <Map />
    <router-view />
  </v-app>
</template>

<style>
.blur .v-application--wrap > *:not(.noblur) {
  filter: blur(1px);
}
</style>

<script>
import { mapState } from 'vuex';
import Map from './components/Map';

export default {
  components: {
    Map,
  },
  computed: {
    ...mapState(['blur'])
  }
}
</script>
