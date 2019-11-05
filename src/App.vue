<template>
  <v-app id="app" :class="{ blur: blur }">
    <Map />
    <router-view />
    <v-alert
      :value="alertVisible"
      dense
      dismissible
      type="error"
      class="noblur"
      @input="close"
    >
      {{errorMsg}}
    </v-alert>
  </v-app>
</template>

<style>
.blur .v-application--wrap > *:not(.noblur) {
  filter: blur(1px);
}
#app .v-alert {
  position: fixed;
  top: 0;
  margin: 10px;
}
</style>

<script>
import { mapState } from 'vuex';
import Map from './components/Map';

export default {
  components: {
    Map,
  },
  data () {
    return {
      alertVisible: false
    }
  },
  watch: {
    errorMsg() {
      this.alertVisible = true;
    }
  },
  computed: {
    ...mapState(['blur', 'errorMsg'])
  },
  methods: {
    close() {
      this.alertVisible = false;
    }
  }
}
</script>
