import { createStore as createVueStore } from 'vuex'

export function createStore (storeOptions) {
  const store = createVueStore(storeOptions)
  return store
}

export function createStoreOptions (rpc) {
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
