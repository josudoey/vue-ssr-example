import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export function createStore (storeOptions) {
  const store = new Vuex.Store(storeOptions)
  return store
}
