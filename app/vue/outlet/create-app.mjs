import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import * as authStoreModule from './auth/store.mjs'

import mixin from '../mixin/index.mjs'
import routes from '../view/routes.mjs'
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
    const $store = router.app.$store
    const preserveState = authStoreModule.register($store)
    if (!preserveState) {
      await $store.dispatch('auth/getState')
    }
    const auth = $store.state.auth

    if (auth.uid && to.name === 'signIn') {
      if (to.query.redirect) {
        next(to.query.redirect)
        return
      }

      next({ name: 'home' })
      return
    }

    if (!auth.uid && to.matched.some(record => record.meta.requiredAuth)) {
      next({
        name: 'signIn',
        query: {
          redirect: to.fullPath
        }
      })
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