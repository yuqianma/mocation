import Vue from 'vue'
import Vuex from 'vuex'
import dayjs from 'dayjs';
import { fetchPoints } from '../util';

Vue.use(Vuex);

const Now = dayjs().add(1, 'h').startOf('h');
const Range = [Now.subtract(1, 'd'), Now];

export default new Vuex.Store({
  state: {
    dateRange: Range.map(d => d.format('YYYY-MM-DD')),
    timeFrom: '00:00',
    timeTo: Now.format('HH:mm'),
    results: [],
    picking: false
  },
  getters: {
    range: ({ dateRange, timeFrom, timeTo }) => ([
      dayjs(dateRange[0] + ' ' + timeFrom).toISOString(),
      dayjs(dateRange[1] + ' ' + timeTo).toISOString()
    ])
  },
  mutations: {
    changeDateRange: (s, _) => (s.dateRange = _),
    changeTimeFrom: (s, _) => (s.timeFrom = _),
    changeTimeTo: (s, _) => (s.timeTo = _),
    setResults: (s, _) => (s.results = _),
    togglePicker: (s) => (s.picking = !s.picking)
  },
  actions: {
    fetchPoints({ commit, getters }) {
      fetchPoints(...getters.range).then(({ results }) => {
        if (results.length > 1000) {
          console.error('too many points:', results);
        }
        commit('setResults', results);
      })
    }
  },
  modules: {
  }
})
