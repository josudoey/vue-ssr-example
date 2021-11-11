import http from 'http'
import staticCache from 'koa-static-cache'
import env from './app/vue/env.js'
import vueRoutes from './app/vue/view/routes.mjs'
import { createVueSSRRouter } from './app/router.mjs'
import app from './app/index.mjs'
import createKoaSSROutlet from './app/ssr-outlet.mjs'

const { publicPath, browserOutputPath } = env
;(async function main () {
  app.use(staticCache(browserOutputPath, {
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
