<template>
  <v-app id="app">
    <Map />
    <router-view />
    <div class="alert-wrapper">
      <v-alert
        :value="alertVisible"
        dismissible
        transition="fade-transition"
        type="error"
        @input="close"
      >
        {{errorMsg && errorMsg.error || errorMsg}}
      </v-alert>
    </div>
  </v-app>
</template>

<style>
#app .alert-wrapper {
  position: fixed;
  top: 0;
  padding: 5px;
  width: 100vw;
}
</style>

<script>
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
    errorMsg() {
      return this.$store.state.errorMsg;
    }
  },
  methods: {
    close() {
      this.alertVisible = false;
    }
  }
}
</script>
