import { createStore } from './store.mjs'
import VuexRouterSync from 'vuex-router-sync'
import Vue from 'vue'
import Router from 'vue-router'
import Layout from './layout.mjs'
import routes from './routes.mjs'
Vue.use(Router)

export default function () {
  const router = new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'active',
    routes: routes
  })
  const store = createStore()
  VuexRouterSync.sync(store, router)

  const app = new Vue({
    store: store,
    router: router,
    render: h => h(Layout)
  })
  return { app, store, router }
}
