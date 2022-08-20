import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes/index.mjs'
import createDebug from 'debug'
import * as authStoreModule from './outlet/auth/store.mjs'
import { once } from 'lodash'
const debug = createDebug('app:create-router')
Vue.use(VueRouter)

export function createRouter ($store) {
  const router = new VueRouter({
    mode: 'history',
    routes
  })

  const PromiseEmptyResolve = Promise.resolve()

  // https://v2.ssr.vuejs.org/zh/guide/data.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%95%B0%E6%8D%AE%E9%A2%84%E5%8F%96-client-data-fetching
  router.beforeResolve((to, from, next) => {
    debug('beforeResolve')
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    if (!activated.length) {
      return next()
    }

    const onceNext = once(next)
    Promise.all(activated.map(function (c) {
      if (c.beforeRouteResolve) {
        return c.beforeRouteResolve.call({ $store }, to, from, onceNext)
      }
      return PromiseEmptyResolve
    })).then(() => {
      onceNext()
    }).catch(onceNext)
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
      debug('to matched some', to.matched)
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
