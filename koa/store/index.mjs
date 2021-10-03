import createDebug from 'debug'
import Vuex from 'vuex'
import Vue from 'vue'
const debug = createDebug('app:koa:store')
Vue.use(Vuex)
export function createKoaStore (ctx) {
  const { session, state } = ctx
  debug('createKoaStore')
  const store = new Vuex.Store({
    state: {},
    actions: {},
    mutations: {},
    getters: {
      context: function () {
        return ctx
      },
      session: function () {
        return session
      }
    }
  })
  store.replaceState({
    ...state
  })
  return store
}

const CONTEXT_STORE = Symbol('context#contextStore')
export function extendKoaStore (context) {
  if (context.hasOwnProperty(CONTEXT_STORE)) {
    return
  }
  Object.defineProperties(context, {
    $store: {
      get () {
        if (this[CONTEXT_STORE]) {
          return this[CONTEXT_STORE]
        }
        this[CONTEXT_STORE] = createKoaStore(this)
        return this[CONTEXT_STORE]
      },
      configurable: true
    }
  })
}
