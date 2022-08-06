import createDebug from 'debug'
import { createRpc } from './rpc.mjs'
const debug = createDebug('app:koa:store')

const createStore = function (rpc) {
  debug('createStore')
  return {
    modules: {},
    actions: {},
    mutations: {},
    getters: {
      rpc () {
        return rpc
      }
    }
  }
}

const CONTEXT_STORE = Symbol('context#store')
const CONTEXT_RPC = Symbol('context#rpc')

export function extendKoaStore (context) {
  Object.defineProperties(context, {
    rpc: {
      get () {
        if (this[CONTEXT_RPC]) {
          return this[CONTEXT_RPC]
        }
        this[CONTEXT_RPC] = createRpc(this)
        return this[CONTEXT_RPC]
      }
    },
    store: {
      get () {
        if (this[CONTEXT_STORE]) {
          return this[CONTEXT_STORE]
        }
        this[CONTEXT_STORE] = createStore(this.rpc)
        return this[CONTEXT_STORE]
      }
    }
  })
}
