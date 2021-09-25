import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import LRU from 'lru-cache'
Vue.use(Vuex)
export function createStore (state) {
  const cache = new LRU({
    max: 10
  })
  const api = axios.create({
    baseURL: '/',
    headers: {
      common: {}
    },
    validateStatus: function () {
      return true
    }
  })
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
