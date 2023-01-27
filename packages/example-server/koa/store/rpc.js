import * as auth from '../route/auth.js'
import * as base64 from '../route/base64.js'
import * as note from '../route/note.js'

const rpcRoutes = {
  getAuthState: auth.getState,
  encodeBase64: base64.encode,
  listNote: note.List
}

const KoaRpcAdapter = function (ctx) {
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

for (const name of Object.keys(rpcRoutes)) {
  const koaRoute = rpcRoutes[name]
  KoaRpcAdapter.prototype[name] = wrapMethod(koaRoute)
}

export function createKoaRpcAdapter (ctx) {
  const fetcher = new KoaRpcAdapter(ctx)
  return function (name, payload) {
    return fetcher[name](payload)
  }
}
