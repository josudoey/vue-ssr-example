import Vue from 'vue'
import Vuex, { type Store, type StoreOptions, type Module, type ActionTree, type MutationTree } from 'vuex'
Vue.use(Vuex)

export function createStore<S> (storeOptions: StoreOptions<S>): Store<S> {
  const store = new Vuex.Store(storeOptions)
  return store
}

export function createStoreOptions (rpc: any): StoreOptions<any> {
  return {
    state () {
      return {}
    },
    actions: {},
    mutations: {},
    getters: {
      rpc () {
        return rpc
      }
    }
  }
}
