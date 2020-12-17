import Koa from 'koa'
import KoaRouter from 'koa-router'
import http from 'http'
import staticCache from 'koa-static-cache'
import expose from '~webpack/expose.js'
const app = new Koa()
const distStaticCache = staticCache(expose.contentBase, {
  prefix: expose.publicPath,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
  dynamic: true
})
app.use(distStaticCache)

const router = new KoaRouter()
const { bundleRenderer, routes } = expose
const renderer = async (ctx) => {
  try {
    console.log(ctx.state)
    const html = await new Promise(function (resolve, reject) {
      bundleRenderer.renderToString(ctx, (err, html) => {
        if (err) {
          return reject(err)
        }
        console.log(ctx.meta)
        resolve(html)
      })
    })
    console.log(ctx.state)
    ctx.body = html
  } catch (err) {
    if (err.code === 404) {
      ctx.status = 404
      return
    }
    ctx.status = 500
  }
}

for (const route of routes) {
  router.get(route.path, renderer)
}

router.get('/base64', function (ctx) {
  ctx.status = 200
  ctx.body = {
    value: Buffer.from(ctx.query.v).toString('base64')
  }
})
app.use(router.routes())

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
