import { createRouter, createWebHistory, createMemoryHistory, NavigationFailureType, isNavigationFailure } from 'vue-router'
import routes from './routes/index.js'
import * as authStoreModule from './store/auth.js'
import once from 'lodash/once.js'
import createDebug from 'debug'
export { NavigationFailureType, isNavigationFailure }
const debug = createDebug('app:create-router')

// see https://next.router.vuejs.org/guide/migration/index.html#new-history-option-to-replace-mode

export function createVueRouter (history, store) {
  const router = createRouter({
    history,
    base: '/',
    linkActiveClass: 'active',
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      return { x: 0, y: 0 }
    },
    routes
  })

  const PromiseEmptyResolve = Promise.resolve()

  router.beforeEach(async (to, from, next) => {
    debug(`beforeEach ${from.name} -> ${to.name}`)
    const preserveState = authStoreModule.register(store)
    if (!preserveState) {
      await store.dispatch('auth/getState')
    }
    const auth = store.state.auth

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

  // https://ssr.vuejs.org/zh/guide/data.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%95%B0%E6%8D%AE%E9%A2%84%E5%8F%96-client-data-fetching
  router.beforeResolve((to, from, next) => {
    debug('beforeResolve')
    const matched = router.resolve(to).matched
    const prevMatched = router.resolve(from).matched

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
        return c.beforeRouteResolve.call({ $store: store }, to, from, onceNext)
      }
      return PromiseEmptyResolve
    })).then(() => {
      onceNext()
    }).catch(onceNext)
  })

  return router
}

export function createMemoryRouter (store) {
  return createVueRouter(createMemoryHistory(), store)
}

export function createWebRouter (store) {
  return createVueRouter(createWebHistory(), store)
}
