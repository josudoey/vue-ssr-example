// see https://getbootstrap.com/docs/4.6/getting-started/webpack/#importing-compiled-css
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import { createApp, createRouter } from '../../../index.js'
import { createStore, createStoreOptions } from '../../../store.js'

import createDebug from 'debug'
import InitalStateParse from '~initial-state/parse.js'
import { createAxiosRpcAdapter } from './rpc/adapter.js'

const debug = createDebug('app:vue:outlet:browser')
NProgress.start()

const main = function (state) {
  const rpc = createAxiosRpcAdapter('/')
  const store = createStore(createStoreOptions(rpc))
  store.replaceState(state)
  const router = createRouter(store)

  const app = createApp({
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
    app.$mount('[data-server-rendered]', true)
    NProgress.done()
  })

  if (app.$root.constructor.config.devtools) {
    window.vm = app
  }
  return app
}

;(async function () {
  const initalState = InitalStateParse(window.__INITIAL_STATE__)
  delete window.__INITIAL_STATE__
  main(initalState)
})()
