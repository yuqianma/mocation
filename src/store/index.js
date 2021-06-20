import Vue from 'vue'
import Vuex from 'vuex'
import dayjs from 'dayjs';
import { fetchPoints, login } from '../services';

Vue.use(Vuex);

const Now = dayjs().add(1, 'h').startOf('h');
const Range = [Now.subtract(1, 'd'), Now];
// const Now = dayjs('2021/06/17 20:00:00');
// const Range = [dayjs('2021/06/17 18:00:00'), Now];

const syncLocalStorage = store => {
  store.subscribe((mutation) => {
    // console.log(mutation);
    const { type, payload } = mutation;
    if (type === 'setUser') {
      window.localStorage.setItem('user', JSON.stringify(payload));
    }
  });
}

const localUserString = window.localStorage.getItem('user');
const initUser = localUserString ? JSON.parse(localUserString) : {};

export default new Vuex.Store({
  plugins: [syncLocalStorage],
  state: {
    user: {
      name: null,
      sessionToken: null,
      ...initUser,
    },
    blur: false,
    errorMsg: '',
    dateRange: Range.map(d => d.format('YYYY-MM-DD')),
    timeFrom: Range[0].format('HH:mm'),
    timeTo: Range[1].format('HH:mm'),
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
    setUser: (s, _) => (s.user = _),
    setBlur: (s, _) => (s.blur = _),
    setErrorMsg: (s, _) => (s.errorMsg = _),
    changeDateRange: (s, _) => (s.dateRange = _),
    changeTimeFrom: (s, _) => (s.timeFrom = _),
    changeTimeTo: (s, _) => (s.timeTo = _),
    setResults: (s, _) => (s.results = _),
    togglePicker: (s, _) => (s.picking = _)
  },
  actions: {
    async fetchPoints({ commit, getters }) {
      try {
        const results = await fetchPoints(...getters.range);
        commit('setResults', results);
      } catch (e) {
        commit('setErrorMsg', e);
        console.error(e);
      }
    },
    login({ commit }, { name, password }) {
      return login({ username: name, password }).then(({ username, sessionToken }) => {
        commit('setUser', {
          name: username,
          sessionToken
        });
      });
    }
  },
  modules: {
  }
})
