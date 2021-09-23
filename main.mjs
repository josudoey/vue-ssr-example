import http from 'http'
import staticCache from 'koa-static-cache'
import env from './env.js'
import vueRoutes from './vue/routes.js'
import router from './koa/router.mjs'
import app from './koa/app.mjs'
import ssrOutlet from './ssr-outlet.mjs'

const { publicPath, assetOutputPath } = env
;(async function main () {
  for (const route of vueRoutes) {
    router.get(route.path, ssrOutlet)
  }
  app.use(staticCache(assetOutputPath, {
    prefix: publicPath,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    dynamic: true
  }))
  app.use(router.routes())
  const server = http.createServer(app.callback())
  server.on('listening', async function () {
    const address = server.address()
    const port = address.port
    console.log(`service listen on ${address.address}:${port}`)
  })
  server.listen(3000)
})()
