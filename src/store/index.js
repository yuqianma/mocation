import Vue from 'vue'
import Vuex from 'vuex'
import dayjs from 'dayjs';

Vue.use(Vuex);

const Now = dayjs().add(1, 'h').startOf('h');
const Range = [Now.subtract(1, 'd'), Now];

export default new Vuex.Store({
  state: {
    dateRange: Range.map(d => d.format('YYYY-MM-DD')),
    timeFrom: '00:00',
    timeTo: Now.format('HH:mm')
  },
  getters: {
    range: ({ dateRange, timeFrom, timeTo }) => ([
      dayjs(dateRange[0] + ' ' + timeFrom),
      dayjs(dateRange[1] + ' ' + timeTo)
    ])
  },
  mutations: {
    changeDateRange: (s, _) => (s.dateRange = _),
    changeTimeFrom: (s, _) => (s.timeFrom = _),
    changeTimeTo: (s, _) => (s.timeTo = _),
  },
  actions: {
  },
  modules: {
  }
})
