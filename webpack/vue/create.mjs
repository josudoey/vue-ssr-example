import { createStore } from './store/index.mjs'
import VuexRouterSync from 'vuex-router-sync'
import Vue from 'vue'
import Router from 'vue-router'
import Layout from './layout/index.mjs'
import routes from './routes/index.js'
import VueMeta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue'

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})
Vue.use(BootstrapVue)
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
    beforeCreate: function () {

    },
    render: h => h(Layout)
  })
  return { app, store, router }
}
