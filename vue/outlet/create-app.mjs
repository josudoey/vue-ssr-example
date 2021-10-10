import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import mixin from '../mixin/index.mjs'
import routes from '../routes.js'
import outlet from './index.mjs'
import createDebug from 'debug'
const debug = createDebug('app:create')
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueMeta, { refreshOnceOnNavigation: false })
Vue.use(BootstrapVue)
Vue.mixin(mixin)

export function createRouter (store) {
  const router = new VueRouter({
    mode: 'history',
    routes
  })

  router.beforeEach(async (to, from, next) => {
    debug(`beforeEach ${from.name} -> ${to.name}`)

    if (to.matched.some(record => record.meta.requiredAuth)) {
      debug(`has auth module ${JSON.stringify(router.app.$store.hasModule('auth'))}`)

      if (!router.app.$store.state.auth) {
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

  return router
}

export default function (storeOptions) {
  const store = new Vuex.Store(storeOptions)
  const router = createRouter(store)
  const vm = new Vue({
    store,
    router,
    ...outlet
  })
  return vm
}
