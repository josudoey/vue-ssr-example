import http from 'http'
import { createExample2VuePlugin } from './example-vue2.js'
import { createExample3VuePlugin } from './example-vue3.js'
import { createCoreApp, createSessionPlugin, createKoaStaticCachePlugin, useSession } from '~core/app/index.js'
import { createSocketIoPlugin, useSocketIoServer } from '~core/app/socket-io.js'
// import { createSocketIoPlugin } from './koa/composable/socket-io.js'
import {
  createRouter
} from './koa/app.js'
import { extendKoaStore } from './koa/store/index.js'

async function createServer (env) {
  const { publicPath, exampleVue2, exampleVue3 } = env
  const sessionPlugin = createSessionPlugin({
    key: 's',
    maxAge: 60 * 60 * 1000
  })
  const router = createRouter()
  const core = createCoreApp({
    keys: ['vue-ssr-example-secret']
  }).use(sessionPlugin)
    .use(function (app) {
      extendKoaStore(app.context)
      app.use(router.routes())
      return this
    })
    .use(createKoaStaticCachePlugin(exampleVue3.browserOutputPath, {
      prefix: publicPath
    }))
    .use(createKoaStaticCachePlugin(exampleVue2.browserOutputPath, {
      prefix: publicPath
    }))
    .use(createExample3VuePlugin({
      ssrPath: env.exampleVue3.ssrPath,
      manifestPath: env.exampleVue3.manifestPath
    }))
    .use(createExample2VuePlugin({
      ssrPath: env.exampleVue2.ssrPath,
      manifestPath: env.exampleVue2.manifestPath
    }))
    .use(function (app) {
      app.use(router.allowedMethods())
    })

  const app = core.instance()

  const server = http.createServer(app.callback())
  const socketIoPlugin = createSocketIoPlugin(server)
  core
    .use(socketIoPlugin)
    .use(setupSocketIo)

  server.on('listening', async function () {
    const address = server.address()
    const port = address.port
    console.log(`service listen on ${address.address}:${port}`)
  })

  return server
}

function setupSocketIo (app) {
  const io = useSocketIoServer()
  const resolveSession = useSession()
  const nop = function () {}

  io.use(async (socket, next) => {
    const { request } = socket
    const ctx = app.createContext(request)
    await resolveSession(ctx, nop)

    const { session } = ctx
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
}

export { createServer }
