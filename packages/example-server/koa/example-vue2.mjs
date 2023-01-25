import createDebug from 'debug'
import staticCache from 'koa-static-cache'
import KoaRouter from 'koa-router'
import * as xsrfToken from './route/xsrf-token.mjs'
const debug = createDebug('app:example-vue2')

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

    const vm = await createApp({
      store: $store,
      router: $router
    })

    debug('renderToString')
    const html = await renderer.renderToString(vm)
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
  ssrRoute
}) {
  const router = new KoaRouter()
  for (const route of routes) {
    router.get(route.name, route.path, xsrfToken.create, ssrRoute)
  }
  return router
}

export default {
  install (app, options) {
    const {
      createRenderer,
      createApp,
      createRouter,
      createStore,
      isNavigationFailure,
      NavigationFailureType,
      manifest
    } = options

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
