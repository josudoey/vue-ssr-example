import http from 'http'
import {
  exampleVue2Env, exampleVue3Env
} from '@vue-ssr-example/example-ssr/env.js'

import ExampleVue2 from './example-vue2.js'
import ExampleVue3 from './example-vue3.js'
import { createApp, createSessionPlugin, useSession, getCurrentInstance } from './koa/composable/index.js'
import { createSocketIoPlugin } from './koa/composable/socket-io.js'
import {
  createRouter, createBrowserStatic
} from './koa/app.js'
import { extendKoaStore } from './koa/store/index.js'

async function createServer (env) {
  const sessionPlugin = createSessionPlugin({
    key: 's',
    maxAge: 60 * 60 * 1000
  })

  const app = createApp({
    keys: ['vue-ssr-example-secret']
  })

  const koaApp = app
    .use(sessionPlugin)
    .use(function (app) {
      extendKoaStore(app.context)
    })
    .instance()

  const router = createRouter()
  koaApp.use(router.routes())

  koaApp.use(createBrowserStatic({
    browserOutputPath: exampleVue3Env.clientOutputPath,
    publicPath: exampleVue3Env.publicPath
  }))

  ExampleVue3.install(koaApp)

  koaApp.use(createBrowserStatic({
    browserOutputPath: exampleVue2Env.clientOutputPath,
    publicPath: exampleVue2Env.publicPath
  }))

  ExampleVue2.install(koaApp)

  koaApp.use(router.allowedMethods())

  const server = http.createServer(koaApp.callback())
  const socketIoPlugin = createSocketIoPlugin(server).use(setupSocketIo)
  app.use(socketIoPlugin)

  server.on('listening', async function () {
    const address = server.address()
    const port = address.port
    console.log(`service listen on ${address.address}:${port}`)
  })

  return server
}

function setupSocketIo (io) {
  const app = getCurrentInstance()
  const koaSession = useSession()

  async function getKoaSession (socket) {
    const response = {
      setHeader () {},
      getHeader () {}
    }
    const ctx = app.createContext(socket.request, response)
    await koaSession(ctx, function () {})
    return ctx.session
  }

  io.use(async (socket, next) => {
    const session = await getKoaSession(socket)
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
