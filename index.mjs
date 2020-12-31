import http from 'http'
import app from './koa/app.mjs'
import router from './koa/router.mjs'
process.on('uncaughtException', function (err) {
  console.error(err.stack)
})

process.on('unhandledRejection', function (err) {
  console.error(err.stack)
})

;(async function main () {
  const vueSSRModule = process.env.NODE_ENV === 'development' ? './koa/vue-ssr/development.js' : './koa/vue-ssr/production.js'
  const renderer = (await import(vueSSRModule)).default
  app.use(renderer.static)
  for (const route of renderer.routes) {
    router.get(route.path, renderer)
  }
  app.use(router.routes())

  const server = http.createServer(app.callback())

  server.on('listening', async function () {
    const address = server.address()
    const port = address.port
    console.log(`service listen on ${address.address}:${port}`)
  })
  server.listen(8080)
})()
