
import * as note from '../route/note.mjs'
import * as base64 from '../route/base64.mjs'
import createDebug from 'debug'
const debug = createDebug('app:koa:store:api')

export const routes = function (axiosConfig) {
  const map = {
    'GET /_/base64': base64.encode,
    'GET /_/note': note.List
  }
  const key = `${axiosConfig.method} ${axiosConfig.url}`
  return map[key]
}

const koaPrefetch = async function (ctx, axiosConfig) {
  const route = routes(axiosConfig)
  await route(ctx)
  return {
    status: ctx.status,
    data: ctx.body
  }
}

export const createPrefetchAPI = function (ctx) {
  return async function (axiosConfig) {
    debug('axiosConfig', axiosConfig)
    return koaPrefetch({
      session: ctx.session,
      query: axiosConfig.params,
      request: {
        body: axiosConfig.data
      }
    }, axiosConfig)
  }
}
