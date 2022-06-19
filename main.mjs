import http from 'http'
import env from './env.cjs'
import {
  ExampleVue3, ExampleVue2,
  createApp, createRouter, createBrowserStatic,
  createSocketIo, extendKoaIo, getKoaSession
} from '~example-koa/index.mjs'
import createExampleVue2SSR from '~example-vue2/create-ssr.mjs'
import createRxampleVue2Manifest from '~example-vue2/create-manifest.mjs'
import createExampleVue3SSR from '~example-vue3/create-ssr.mjs'
import createRxampleVue3Manifest from '~example-vue3/create-manifest.mjs'

const { publicPath, exampleVue2, exampleVue3 } = env

;(async function main () {
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

  const exampleVue3SSR = await createExampleVue3SSR({ ssrPath: env.exampleVue3.ssrPath })
  const exampleVue3Manifest = createRxampleVue3Manifest({ manifestPath: env.exampleVue3.manifestPath })
  ExampleVue3.install(app, {
    ...exampleVue3SSR,
    manifest: exampleVue3Manifest
  })

  const exampleVue2Manifest = createRxampleVue2Manifest({
    vueSSRClientManifestPath: env.exampleVue2.vueSSRClientManifestPath
  })
  const exampleVue2SSR = createExampleVue2SSR({
    ssrPath: env.exampleVue2.ssrPath
  })
  ExampleVue2.install(app, {
    ...exampleVue2SSR,
    clientManifest: exampleVue2Manifest
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

  server.listen(3000)
})()
