import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

import Dashboard from '../views/Dashboard';
import Login from '../views/Login';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    component: Login,
    beforeEnter(to, from, next) {
      if (store.state.user.sessionToken) {
        next({ path: '/', replace: true });
      } else {
        next();
      }
    }
  },
  {
    path: '/',
    component: Dashboard,
    beforeEnter(to, from, next) {
      if (!store.state.user.sessionToken) {
        next({ path: '/login', replace: true });
      } else {
        next();
      }
    },
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
