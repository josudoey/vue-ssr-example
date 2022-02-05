import Koa from 'koa'
import KoaSession from 'koa-session'
import { extendKoaStore } from './store/index.mjs'
export { default as ExampleVue2 } from './example-vue2.mjs'
export { createRouter } from './router.mjs'

export function createApp () {
  const app = new Koa()
  app.keys = ['vue-ssr-example-secret']
  app.use(KoaSession({
    key: 's',
    maxAge: 60 * 60 * 1000
  }, app))
  extendKoaStore(app.context)
  return app
}
