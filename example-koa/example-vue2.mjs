import createDebug from 'debug'
import staticCache from 'koa-static-cache'
import KoaRouter from 'koa-router'
import * as xsrfToken from './route/xsrf-token.mjs'
const debug = createDebug('app:example-vue2')

export function createRoute ({
  createRenderer,
  createApp,
  createRouter,
  createStore,
  isNavigationFailure,
  NavigationFailureType,
  clientManifest
}) {
  const renderer = createRenderer(clientManifest)
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

    const errOrRoute = await $router.push(ctx.url).catch((err) => err)
    await new Promise((resolve) => {
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

    const matchedComponents = $router.getMatchedComponents()
    if (!matchedComponents.length) {
      ctx.throw(new Error('component not matched'))
      return
    }

    const vm = await createApp({
      store: $store,
      router: $router
    })

    debug('renderToString')
    const html = await renderer.renderToString(vm, {
      state: ctx.state
    })
    debug('renderToString done')

    ctx.status = 200
    ctx.type = 'text/html'
    ctx.body = html
  }
}

export function createBrowserStatic ({
  browserOutputPath,
  publicPath
}) {
  return staticCache(browserOutputPath, {
    prefix: publicPath,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    dynamic: true
  })
}

export const createSSRRouter = function ({
  routes,
  createRenderer,
  createApp,
  createRouter,
  createStore,
  isNavigationFailure,
  NavigationFailureType,
  clientManifest
}) {
  const router = new KoaRouter()
  const ssrRoute = createRoute({
    createRenderer,
    createApp,
    createRouter,
    createStore,
    isNavigationFailure,
    NavigationFailureType,
    clientManifest
  })
  for (const route of routes) {
    router.get(route.name, route.path, xsrfToken.create, ssrRoute)
  }
  return router
}

export default {
  install (app, options) {
    const { router, exampleVue2 } = options
    const {
      routes,
      createRenderer,
      createApp,
      createRouter,
      createStore,
      isNavigationFailure,
      NavigationFailureType,
      clientManifest,
      browserOutputPath,
      publicPath
    } = exampleVue2
    app.use(createBrowserStatic({
      browserOutputPath,
      publicPath
    }))

    const ssrRouter = createSSRRouter({
      routes,
      createRenderer,
      createApp,
      createRouter,
      createStore,
      isNavigationFailure,
      NavigationFailureType,
      clientManifest
    })
    router.use(
      ssrRouter.routes(),
      ssrRouter.allowedMethods()
    )
  }
}
