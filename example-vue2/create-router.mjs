import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes/index.mjs'
import createDebug from 'debug'
import * as authStoreModule from './outlet/auth/store.mjs'
const debug = createDebug('app:create-router')
Vue.use(VueRouter)

export function createRouter ($store) {
  const router = new VueRouter({
    mode: 'history',
    routes
  })

  router.beforeEach(async (to, from, next) => {
    debug(`beforeEach ${from.name} -> ${to.name}`)
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
