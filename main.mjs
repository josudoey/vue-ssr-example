import http from 'http'
import env from './env.cjs'
import { ExampleVue2, createApp, createRouter } from '~example-koa/index.mjs'
import vue2ExampleManifest from './example-vue2-manifest.mjs'
import * as exampleVue2SSR from './example-vue2-ssr.mjs'

const { publicPath, exampleVue2 } = env

;(async function main () {
  const app = createApp({})
  const router = createRouter()
  app.use(router.routes())
  ExampleVue2.install(app, {
    ...exampleVue2SSR,
    publicPath,
    clientManifest: vue2ExampleManifest,
    browserOutputPath: exampleVue2.browserOutputPath
  })
  app.use(router.allowedMethods())

  const server = http.createServer(app.callback())
  server.on('listening', async function () {
    const address = server.address()
    const port = address.port
    console.log(`service listen on ${address.address}:${port}`)
  })
  server.listen(3000)
})()
