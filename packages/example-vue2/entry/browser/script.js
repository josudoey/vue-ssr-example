// see https://getbootstrap.com/docs/4.6/getting-started/webpack/#importing-compiled-css
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import { createApp, createStore, createRouter } from '../../index.js'

import createDebug from 'debug'
import state from './inital-state.js'
import { createRpc } from './rpc/create.js'

const debug = createDebug('app:vue:outlet:browser')
NProgress.start()

export function createStoreOptions (state) {
  debug('createStore')

  const rpc = createRpc('/')
  return {
    state,
    actions: {},
    mutations: {},
    getters: {
      rpc: function () {
        return rpc
      }
    }
  }
}

const main = function (state) {
  const storeOptions = createStoreOptions(state)
  const store = createStore(storeOptions)
  const router = createRouter(store)

  const vm = createApp({
    store,
    router
  })

  let nextHref

  router.beforeEach((to, from, next) => {
    debug('beforeEach vue-router ')
    NProgress.start()
    nextHref = to.fullPath

    next()
  })

  router.afterEach((to, from) => {
    debug('afterEach vue-router')
    NProgress.done()
  })

  router.onError((err) => {
    if (!err.request) {
      window.location.reload()
      return
    }

    if (!nextHref) {
      window.location.reload()
      return
    }

    window.location.href = nextHref
  })

  router.onReady(() => {
    debug('onReady')
    vm.$mount('[data-server-rendered]', true)
    NProgress.done()
  })

  if (vm.$root.constructor.config.devtools) {
    window.vm = vm
  }
  return vm
}

;(async function () {
  main(state)
})()
