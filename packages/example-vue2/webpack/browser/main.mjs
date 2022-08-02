// see https://getbootstrap.com/docs/4.6/getting-started/webpack/#importing-compiled-css
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import { createApp, createStore, createRouter } from '../../index.mjs'
import VuexRouterSync from 'vuex-router-sync'

import createDebug from 'debug'
import LRU from 'lru-cache'
import { create as axiosCreate } from 'axios'
import state from './inital-state.mjs'

const debug = createDebug('app:vue:outlet:browser')
NProgress.start()

const createApi = function () {
  if (!axiosCreate) {
    return
  }
  const api = axiosCreate({
    baseURL: '/',
    headers: {
      common: {}
    },
    validateStatus: function () {
      return true
    }
  })
  return api
}

const createFetcher = function () {
  if (!axiosCreate) {
    return
  }
  const api = axiosCreate({
    baseURL: '/',
    headers: {
      common: {}
    },
    validateStatus: function () {
      return true
    }
  })
  return api
}

export function createStoreOptions (state) {
  debug('createStore')
  const cache = new LRU({
    max: 10
  })

  const api = createApi()
  const fetcher = createFetcher()
  return {
    state,
    actions: {},
    mutations: {},
    getters: {
      api: function () {
        return api
      },
      cache: function () {
        return cache
      },
      fetcher () {
        return fetcher
      }
    }
  }
}

const main = function (state) {
  const storeOptions = createStoreOptions(state)
  const store = createStore(storeOptions)
  const router = createRouter(store)
  VuexRouterSync.sync(store, router)
  const vm = window.vm = createApp({
    store,
    router
  })

  let nextHref

  // https://ssr.vuejs.org/zh/guide/data.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%95%B0%E6%8D%AE%E9%A2%84%E5%8F%96-client-data-fetching
  vm.$router.onReady(() => {
    debug('onReady vue-router')
    vm.$mount('[data-server-rendered]', true)
    NProgress.done()
  })
  vm.$router.beforeEach((to, from, next) => {
    debug('beforeEach vue-router ')
    NProgress.start()
    nextHref = to.fullPath
    next()
  })
  vm.$router.afterEach((to, from) => {
    debug('afterEach vue-router')
    NProgress.done()
  })

  vm.$router.onError((err) => {
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
  return vm
}

;(async function () {
  main(state)
})()
