import http from 'http'
import app from './koa/app.mjs'

(async function main () {
  if (process.env.NODE_ENV === 'development') {
    const devVueSSR = (await import('./koa/vue-ssr/development.mjs')).default
    app.use(devVueSSR)
  } else {
    const prodVueSSR = (await import('./koa/vue-ssr/production.mjs')).default
    app.use(prodVueSSR)
  }

  const server = http.createServer(app.callback())

  server.on('listening', async function () {
    const address = server.address()
    const port = address.port
    console.log(`service listen on ${address.address}:${port}`)
  })
  server.listen(8080)
})()
