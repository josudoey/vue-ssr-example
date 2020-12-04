import Koa from 'koa'
import http from 'http'
import renderer from './app/renderer.js'
import staticCache from 'koa-static-cache'
import expose from '_vue/expose.js'
const app = new Koa()
const distStaticCache = staticCache(expose.dist.staitc, {
  maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
  dynamic: true
})
app.use(distStaticCache)
app.use(async (ctx) => {
  try {
    const html = await new Promise(function (resolve, reject) {
      renderer.renderToString({
        url: ctx.url
      }, (err, html) => {
        if (err) {
          return reject(err)
        }
        resolve(html)
      })
    })
    ctx.body = html
  } catch (err) {
    console.error(err)
    if (err.code === 404) {
      ctx.status = 404
      return
    }
    ctx.status = 500
  }
})

const server = http.createServer(app.callback())

server.on('listening', async function () {
  const address = server.address()
  const port = address.port
  console.log(`service listen on ${address.address}:${port}`)
  // app.emit('listening', server)
  // configWebpackDevServer.proxy = [{
  //   context: ['**', '!/b/*'],
  //   target: `http://localhost:${port}`
  // }]
  // const webpackServer = new WebpackDevServer(compiler, configWebpackDevServer)
  // webpackServer.listen(config.port, config.host, function () {
  //   const httpListen = `${config.host}:${config.port}`
  //   logger.info('[webpack-dev-server]', 'Http Listen in ' + httpListen)
  // })
})
server.listen(8080)
