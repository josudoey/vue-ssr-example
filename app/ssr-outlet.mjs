import { createRenderer, createSSRApp, createRouter, createStore, isNavigationFailure, NavigationFailureType } from '../create-ssr-app.mjs'
import clientManifest from './ssr-manifest.mjs'
import createDebug from 'debug'
const debug = createDebug('app:koa-ssr-outlet')

export default function createKoaSSROutlet () {
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
      ctx.throw(errOrRoute)
      return
    }

    const vm = await createSSRApp({
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
