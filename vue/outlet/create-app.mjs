import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue'
import mixin from '../mixin/index.mjs'
import { createStore } from '../store/index.mjs'
import routes from '../routes.js'
import outlet from './index.mjs'
Vue.use(VueRouter)
Vue.use(VueMeta, { refreshOnceOnNavigation: false })
Vue.use(BootstrapVue)
Vue.mixin(mixin)

export default function (state) {
  const store = createStore(state)
  const router = new VueRouter({
    mode: 'history',
    routes
  })

  const vm = new Vue({
    store,
    router,
    ...outlet
  })

  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiredAuth)) {
      if (!router.app.$store.state.auth.uid) {
        next({
          name: 'signIn',
          query: {
            redirect: to.fullPath
          }
        })
        return
      }
      next()
      return
    }
    next()
  })
  return vm
}
