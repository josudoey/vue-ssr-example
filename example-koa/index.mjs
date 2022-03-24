import Koa from 'koa'
import KoaSession from 'koa-session'
import { extendKoaStore } from './store/index.mjs'
import staticCache from 'koa-static-cache'
export { default as ExampleVue2 } from './example-vue2.mjs'
export { default as ExampleVue3 } from './example-vue3.mjs'
export { createRouter } from './router.mjs'
export { createSocketIo, extendKoaIo } from './socket-io/index.mjs'

const KOA_SESSION = Symbol('koa#session')

export function createApp () {
  const app = new Koa()
  app.keys = ['vue-ssr-example-secret']
  const koaSession = KoaSession({
    key: 's',
    maxAge: 60 * 60 * 1000
  }, app)
  app.use(koaSession)
  app[KOA_SESSION] = koaSession
  extendKoaStore(app.context)
  return app
}

export function createBrowserStatic ({
  browserOutputPath,
  publicPath
}) {
  return staticCache(browserOutputPath, {
    prefix: publicPath,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    dynamic: true
  })
}

export async function getKoaSession (app, request) {
  const response = {
    setHeader () {},
    getHeader () { }
  }
  const ctx = app.createContext(request, response)
  const koaSession = app[KOA_SESSION]
  if (!koaSession) {
    return
  }
  await koaSession(ctx, function () {})
  return ctx.session
}
