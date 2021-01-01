import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from './auth/index.mjs'
Vue.use(Vuex)
export function createStore (state) {
  const store = new Vuex.Store({
    state: {},
    actions: {},
    mutations: {}
  })
  store.replaceState(state)
  auth.register(store)
  return store
}
