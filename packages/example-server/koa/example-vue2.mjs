import createDebug from 'debug'
import KoaRouter from 'koa-router'
import * as xsrfToken from './route/xsrf-token.mjs'

import { createRequire } from 'module'
const debug = createDebug('app:example-vue2')
function createSSR ({ ssrPath }) {
  const ssrModuleExports = createRequire(import.meta.url)(ssrPath)
  const { createRenderer, createRouter, createStore, createApp, isNavigationFailure, NavigationFailureType } = ssrModuleExports
  return { createRenderer, createRouter, createStore, createApp, isNavigationFailure, NavigationFailureType }
}

function createManifest ({ manifestPath }) {
  const manifest = createRequire(import.meta.url)(manifestPath)
  return manifest
}

export function createRoute (ssr) {
  const {
    createRenderer,
    createApp,
    createRouter,
    createStore,
    isNavigationFailure,
    NavigationFailureType,
    manifest
  } = ssr

  const renderer = createRenderer(manifest)
  return async function (ctx, next) {
    const routeName = ctx._matchedRouteName
    debug('path', ctx.path)
    debug('routeName', routeName)

    if (ctx.headers['x-xsrf-token']) {
      // is api
      return
    }

    const $store = createStore(ctx.store)
    $store.replaceState(ctx.state)
    const $router = createRouter($store)

    debug(`router push ${ctx.url}`)
    const errOrRoute = await $router.push(ctx.url).catch((err) => err)
    await new Promise((resolve) => {
      debug('router onReady')
      return $router.onReady(resolve)
    })

    // see https://router.vuejs.org/guide/advanced/navigation-failures.html#navigation-failures-s-properties
    if (isNavigationFailure(errOrRoute, NavigationFailureType.redirected)) {
      if (!$router.currentRoute.name) {
        debug('invalid route; redirect default /')
        ctx.redirect('/')
        return
      }
      debug('redirect', $router.currentRoute.fullPath)
      ctx.redirect($router.currentRoute.fullPath)
      return
    }

    const app = await createApp({
      store: $store,
      router: $router
    })

    debug('renderToString')
    const html = await renderer.renderToString(app)
    debug('renderToString done')

    ctx.status = 200
    ctx.type = 'text/html'
    ctx.body = html
  }
}

export default {
  install (app, modulePaths) {
    const {
      manifestPath,
      ssrPath
    } = modulePaths

    const manifest = createManifest({
      manifestPath
    })

    const {
      createRenderer,
      createApp,
      createRouter,
      createStore,
      isNavigationFailure,
      NavigationFailureType
    } = createSSR({
      ssrPath
    })

    const vueRouter = createRouter()
    const matchedComponent = async function (ctx, next) {
      const matchedComponents = vueRouter.getMatchedComponents(ctx.path)
      if (!matchedComponents.length) {
        return
      }
      await next()
    }

    const ssrRoute = createRoute({
      createRenderer,
      createApp,
      createRouter,
      createStore,
      isNavigationFailure,
      NavigationFailureType,
      manifest
    })

    const router = new KoaRouter()
    router.get('/(.*)', matchedComponent, xsrfToken.create, ssrRoute)
    app.use(router.routes())
  }
}
