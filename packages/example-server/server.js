import http from 'http'
import ExampleVue2 from './example-vue2.js'
import ExampleVue3 from './example-vue3.js'
import {
  createApp, createRouter, createBrowserStatic,
  createSocketIo, extendKoaIo, getKoaSession
} from './koa/app.js'

async function createServer (env) {
  const { publicPath, exampleVue2, exampleVue3 } = env
  const app = createApp({})
  const router = createRouter()
  app.use(router.routes())
  app.use(createBrowserStatic({
    browserOutputPath: exampleVue3.browserOutputPath,
    publicPath
  }))

  app.use(createBrowserStatic({
    browserOutputPath: exampleVue2.browserOutputPath,
    publicPath
  }))

  ExampleVue3.install(app, {
    ssrPath: env.exampleVue3.ssrPath,
    manifestPath: env.exampleVue3.manifestPath
  })

  ExampleVue2.install(app, {
    ssrPath: env.exampleVue2.ssrPath,
    manifestPath: env.exampleVue2.manifestPath
  })

  app.use(router.allowedMethods())

  const server = http.createServer(app.callback())
  server.on('listening', async function () {
    const address = server.address()
    const port = address.port
    console.log(`service listen on ${address.address}:${port}`)
  })
  const io = createSocketIo(server)

  extendKoaIo(app.context, io)
  io.use(async (socket, next) => {
    const session = await getKoaSession(app, socket.request)
    const { auth } = session
    if (!auth) {
      const err = new Error('unauthorized')
      next(err)
      return
    }

    socket.data.auth = auth
    next()
  })

  // https://socket.io/docs/v4/server-instance/#fetchsockets
  setInterval(function () {
    io.to('time').emit('now', Date.now())
  }, 1000)

  io.on('connection', (socket) => {
    // see https://socket.io/docs/v4/server-socket-instance/#events

    socket.join('time')
  })

  return server
}

export { createServer }
