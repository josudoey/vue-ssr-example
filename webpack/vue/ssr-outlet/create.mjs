import './style.css'
import { createStore } from '../store/index.mjs'
import VuexRouterSync from 'vuex-router-sync'
import Vue from 'vue'
import Router from 'vue-router'
import routes from '../routes.js'
import VueMeta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue'
import mixin from '../mixin/index.mjs'
import component from './index.mjs'
Vue.use(Router)
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})
Vue.use(BootstrapVue)
Vue.mixin(mixin)
export default function (state) {
  const router = new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'active',
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      return { x: 0, y: 0 }
    },
    routes: routes
  })

  const store = createStore(state)
  VuexRouterSync.sync(store, router)

  const ssrOutlet = new Vue({
    ...component,
    router: router,
    store: store
  })
  return { ssrOutlet, store, router }
}
