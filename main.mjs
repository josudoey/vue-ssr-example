import http from 'http'
import staticCache from 'koa-static-cache'
import env from './vue/env.js'
import vueRoutes from './vue/view/routes.mjs'
import { createVueSSRRouter } from './koa/router.mjs'
import app from './koa/app.mjs'
import createKoaSSROutlet from './koa-ssr-outlet.mjs'

const { publicPath, assetOutputPath } = env
;(async function main () {
  app.use(staticCache(assetOutputPath, {
    prefix: publicPath,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    dynamic: true
  }))

  const koaSSROutlet = createKoaSSROutlet()
  const router = createVueSSRRouter(vueRoutes, koaSSROutlet)

  app
    .use(router.routes())
    .use(router.allowedMethods())

  const server = http.createServer(app.callback())
  server.on('listening', async function () {
    const address = server.address()
    const port = address.port
    console.log(`service listen on ${address.address}:${port}`)
  })
  server.listen(3000)
})()
