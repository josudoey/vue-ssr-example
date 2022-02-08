import http from 'http'
import env from './env.cjs'
import { ExampleVue3, ExampleVue2, createApp, createRouter, createBrowserStatic } from '~example-koa/index.mjs'
import exampleVue2Manifest from './example-vue2-manifest.mjs'
import * as exampleVue2SSR from './example-vue2-ssr.mjs'
import exampleVue3Manifest from './example-vue3-manifest.mjs'
import * as exampleVue3SSR from './example-vue3-ssr.mjs'

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

  ExampleVue3.install(app, {
    ...exampleVue3SSR,
    manifest: exampleVue3Manifest
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
  server.listen(3000)
})()
