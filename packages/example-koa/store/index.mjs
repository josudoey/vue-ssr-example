import LRU from 'lru-cache'
import createDebug from 'debug'
import * as auth from '../route/auth.mjs'
import * as base64 from '../route/base64.mjs'
import * as note from '../route/note.mjs'
import { createPrefetchAPI } from './api.mjs'
const debug = createDebug('app:koa:store')

const fetcherRoutes = {
  getAuthState: auth.getState,
  encodeBase64: base64.encode,
  listNote: note.List
}

const Fetcher = function (ctx) {
  this.ctx = ctx
}

const wrapMethod = function (koaRoute) {
  return async function () {
    const ctx = this.ctx
    await koaRoute(ctx)
    return {
      status: ctx.status,
      data: ctx.body
    }
  }
}

for (const name of Object.keys(fetcherRoutes)) {
  const koaRoute = fetcherRoutes[name]
  Fetcher.prototype[name] = wrapMethod(koaRoute)
}

const createStore = function (fetcher) {
  debug('createStore')
  const cache = new LRU({
    max: 10
  })
  const api = createPrefetchAPI(fetcher.ctx)
  return {
    modules: {},
    actions: {},
    mutations: {},
    getters: {
      fetcher () {
        return fetcher
      },
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
const CONTEXT_FETCHER = Symbol('context#fetcher')

export function extendKoaStore (context) {
  Object.defineProperties(context, {
    fetcher: {
      get () {
        if (this[CONTEXT_FETCHER]) {
          return this[CONTEXT_FETCHER]
        }
        this[CONTEXT_FETCHER] = new Fetcher(this)
        return this[CONTEXT_FETCHER]
      }
    },
    store: {
      get () {
        if (this[CONTEXT_STORE]) {
          return this[CONTEXT_STORE]
        }
        this[CONTEXT_STORE] = createStore(this.fetcher)
        return this[CONTEXT_STORE]
      }
    }
  })
}
