import LRU from 'lru-cache'
import createDebug from 'debug'
import { createPrefetchAPI } from './api.mjs'
const debug = createDebug('app:koa:store')

const createStore = function (ctx) {
  debug('createStore')
  const cache = new LRU({
    max: 10
  })
  const api = createPrefetchAPI(ctx)
  return {
    modules: {},
    actions: {},
    mutations: {},
    getters: {
      cache () {
        return cache
      },
      api () {
        return api
      },
      context () {
        return this
      },
      session () {
        return this.session
      }
    }
  }
}

const CONTEXT_STORE = Symbol('context#store')

export function extendKoaStore (context) {
  Object.defineProperties(context, {
    store: {
      get () {
        if (this[CONTEXT_STORE]) {
          return this[CONTEXT_STORE]
        }
        this[CONTEXT_STORE] = createStore(this)
        return this[CONTEXT_STORE]
      },
      configurable: true
    }
  })
}
