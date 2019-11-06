import Vue from 'vue'
import Vuex from 'vuex'
import dayjs from 'dayjs';
import { fetchPoints, login } from '../services';

Vue.use(Vuex);

const Now = dayjs().add(1, 'h').startOf('h');
const Range = [Now.subtract(1, 'd'), Now];

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
    fetchPoints({ commit, getters }) {
      return fetchPoints(...getters.range).then((res) => {
        if (!res) {
          return;
        }
        const { results = [] } = res;
        if (results.length > 1000) {
          commit('setErrorMsg', 'too many points');
          console.error('too many points:', results);
        } else {
          commit('setResults', results);
        }
      });
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
