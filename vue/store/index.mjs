import Vue from 'vue'
import Vuex from 'vuex'
import LRU from 'lru-cache'
import createDebug from 'debug'
import { create as axiosCreate } from 'axios'
const debug = createDebug('app:store')
Vue.use(Vuex)

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

export function createStore (state) {
  debug('createStore')
  const cache = new LRU({
    max: 10
  })

  const api = createApi()
  const store = new Vuex.Store({
    state: {},
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
  })
  store.replaceState(state)
  return store
}
