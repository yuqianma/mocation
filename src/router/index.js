import Vue from 'vue';
import VueRouter from 'vue-router';

import Map from '../components/Map';
import Picker from '../components/Picker';

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    components: {
      map: Map,
      picker: Picker,
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
