import Koa from 'koa'
import KoaSession from 'koa-session'
import { createRouter } from './router.mjs'
import ExampleVue2 from './example-vue2.mjs'
import { extendKoaStore } from './store/index.mjs'

export function createApp ({
  exampleVue2
}) {
  const app = new Koa()
  app.keys = ['vue-ssr-example-secret']
  app.use(KoaSession({
    key: 's',
    maxAge: 60 * 60 * 1000
  }, app))
  extendKoaStore(app.context)

  const router = createRouter()
  app
    .use(router.routes())

  ExampleVue2.install(app, {
    router,
    exampleVue2
  })

  app.use(router.allowedMethods())
  return app
}
