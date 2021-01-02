import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from './auth/index.mjs'
import axios from 'axios'
Vue.use(Vuex)
export function createStore (state) {
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
      }
    }
  })
  store.replaceState(state)
  auth.register(store)
  return store
}
