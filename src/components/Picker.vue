<template>
<v-container class="container" fluid>
  <v-card color="#fff">
    <v-date-picker
      v-model="dateRange"
      no-title
      full-width
      show-current
      range
    ></v-date-picker>
    <v-slider
      v-model="timeFrom"
      :tick-labels="ticksLabels"
      :max="12"
      color="grey"
      track-color="primary"
      step="1"
      ticks="always"
      thumb-label
    ></v-slider>
    <v-slider
      v-model="timeTo"
      :tick-labels="ticksLabels"
      :max="12"
      track-color="grey"
      step="1"
      ticks="always"
      thumb-label
    ></v-slider>

    <v-card-actions class="actions">
      <v-btn depressed color="primary">Query</v-btn>
    </v-card-actions>
  </v-card>
</v-container>
</template>

<style scoped>
.container {
  position: fixed;
}
.actions {
  justify-content: flex-end;
}
</style>

<script>
export default {
  name: 'Picker',
  data: () => ({
    ticksLabels: [...Array(13)].map((_, i) => {
      switch (i) {
        case 0:
        case 6:
        case 12:
          return i + '';
        default:
          return ''
      }
    })
  }),
  computed: {
    timeFrom: {
      get () {
        return this.$store.state.timeFrom.split(':')[0];
      },
      set (v) {
        this.$store.commit('changeTimeFrom', v + ':00');
      }
    },
    timeTo: {
      get () {
        return this.$store.state.timeTo.split(':')[0];
      },
      set (v) {
        this.$store.commit('changeTimeTo', v + ':00');
      }
    },
    dateRange: {
      get () {
        return this.$store.state.dateRange;
      },
      set (v) {
        this.$store.commit('changeDateRange', v);
      }
    }
  },
}
</script>
