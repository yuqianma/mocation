<template>
<v-container
  fluid
  :class="{ 'fill-height': picking }"
  style="align-items: flex-start;"
  @click="handleBlankClick"
>
  <v-slide-y-transition>
    <v-card color="#fff" v-show="picking">
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
        :max="24"
        color="grey"
        track-color="primary"
        step="1"
        ticks="always"
        thumb-label
      ></v-slider>
      <v-slider
        v-model="timeTo"
        :tick-labels="ticksLabels"
        :max="24"
        track-color="grey"
        step="1"
        ticks="always"
        thumb-label
      ></v-slider>

      <v-card-actions class="actions">
        <v-btn @click="query" depressed color="primary">Query</v-btn>
      </v-card-actions>
    </v-card>
  </v-slide-y-transition>

  <v-btn
    absolute
    fab
    right
    color="primary"
    class="fab"
    @click="showPicker"
    v-show="!picking"
  >
    <v-icon>mdi-calendar-range</v-icon>
  </v-btn>
</v-container>
</template>

<style scoped>
.container {
  position: fixed;
}
.actions {
  justify-content: flex-end;
}
.fab {
  position: fixed;
  bottom: 36px;
}
</style>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'Picker',
  data: () => ({
    ticksLabels: [...Array(25)].map((_, i) => i % 6 === 0 ? ('' + i) : '')
  }),
  computed: {
    picking () {
      return this.$store.state.picking;
    },
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
        this.$store.commit('changeDateRange', v.sort());
      }
    }
  },
  methods: {
    ...mapMutations(['setBlur', 'togglePicker']),
    ...mapActions(['fetchPoints']),
    query() {
      this.fetchPoints();
      this.hidePicker();
    },
    showPicker() {
      this.togglePicker(true);
      this.setBlur(true);
    },
    hidePicker() {
      this.togglePicker(false);
      this.setBlur(false);
    },
    handleBlankClick(e) {
      if (e.target === e.currentTarget) {
        this.hidePicker();
      }
    }
  }
}
</script>
