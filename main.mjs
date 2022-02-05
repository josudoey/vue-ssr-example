import http from 'http'
import env from './env.js'
import { createApp } from '~example-koa/index.mjs'
import vue2ExampleManifest from './example-vue2-manifest.mjs'
import { routes, createRenderer, createSSRApp, createRouter, createStore, isNavigationFailure, NavigationFailureType } from './example-vue2-ssr.mjs'

const { publicPath, browserOutputPath } = env
;(async function main () {
  const app = createApp({
    exampleVue2: {
      routes,
      createRenderer,
      createSSRApp,
      createRouter,
      createStore,
      isNavigationFailure,
      NavigationFailureType,
      clientManifest: vue2ExampleManifest,
      publicPath,
      browserOutputPath
    }
  })

  const server = http.createServer(app.callback())
  server.on('listening', async function () {
    const address = server.address()
    const port = address.port
    console.log(`service listen on ${address.address}:${port}`)
  })
  server.listen(3000)
})()
