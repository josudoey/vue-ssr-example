// see https://getbootstrap.com/docs/4.6/getting-started/webpack/#importing-compiled-css
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import createApp from '../create-app.mjs'
import VuexRouterSync from 'vuex-router-sync'

import createDebug from 'debug'
import LRU from 'lru-cache'
import { create as axiosCreate } from 'axios'
const debug = createDebug('app:outlet:asset')
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

export function createStoreOptions (state) {
  debug('createStore')
  const cache = new LRU({
    max: 10
  })

  const api = createApi()
  return {
    state: state,
    actions: {},
    mutations: {},
    getters: {
      api: function () {
        return api
      },
      cache: function () {
        return cache
      }
    }
  }
}

const main = function (state) {
  const vm = createApp(createStoreOptions(state))
  VuexRouterSync.sync(vm.$store, vm.$router)

  // https://ssr.vuejs.org/zh/guide/data.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%95%B0%E6%8D%AE%E9%A2%84%E5%8F%96-client-data-fetching
  vm.$router.onReady(() => {
    debug('onReady vue-router')
    vm.$mount('[data-server-rendered]', true)
    NProgress.done()
  })
  vm.$router.beforeEach((to, from, next) => {
    debug('beforeEach vue-router ')
    NProgress.start()
    next()
  })
  vm.$router.afterEach((to, from) => {
    debug('afterEach vue-router')
    NProgress.done()
  })
  return vm
}

;(async function () {
  main(window.__INITIAL_STATE__)
  delete window.__INITIAL_STATE__
})()
