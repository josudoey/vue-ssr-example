import http from 'http'
import staticCache from 'koa-static-cache'
import env from './vue/env.js'
import vueRoutes from './vue/routes.js'
import koaRouter from './koa/router.mjs'
import app from './koa/app.mjs'

import koaSSROutlet from './koa-ssr-outlet.mjs'
import * as xsrfToken from './koa/route/xsrf-token.mjs'

const { publicPath, assetOutputPath } = env
;(async function main () {
  app.use(staticCache(assetOutputPath, {
    prefix: publicPath,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    dynamic: true
  }))

  // const ssrRouter = new KoaRouter()
  for (const route of vueRoutes) {
    koaRouter.use(xsrfToken.create)
    koaRouter.get(route.name, route.path, koaSSROutlet)
  }

  app
    .use(koaRouter.routes())
    .use(koaRouter.allowedMethods())

  const server = http.createServer(app.callback())
  server.on('listening', async function () {
    const address = server.address()
    const port = address.port
    console.log(`service listen on ${address.address}:${port}`)
  })
  server.listen(3000)
})()
