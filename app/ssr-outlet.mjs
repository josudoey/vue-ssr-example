import createSSRApp from './vue/create-ssr-app.mjs'
import createRenderer from './vue/create-renderer.mjs'
import clientManifest from './vue/ssr-manifest.mjs'
import { isNavigationFailure, NavigationFailureType } from './vue/errors.mjs'
import createDebug from 'debug'
import zlib from 'zlib'
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

    const vm = await createSSRApp(ctx.store)
    const { $router, $store } = vm
    $store.replaceState(ctx.state)

    const errOrRoute = await $router.push(ctx.url).catch((err) => err)
    await new Promise((resolve) => {
      return vm.$router.onReady(resolve)
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

    debug('renderToString')

    const html = await renderer.renderToString(vm, {
      state: ctx.state,
      rendered (ctx) {
        // see https://ssr.vuejs.org/guide/data.html#final-state-injection
        // see https://github.com/vuejs/vue/blob/0603ff695d2f41286239298210113cbe2b209e28/src/server/create-renderer.js#L89

        debug('rendered')
        const meta = vm.$route.meta
        debug('meta', meta)
        const initalState = zlib.deflateSync(
          JSON.stringify(
            ctx.state
          ), {
            level: 9
          }).toString('base64')
        debug('initalState', initalState)
        ctx.state = initalState
      }
    })
    debug('renderToString done')

    ctx.status = 200
    ctx.type = 'text/html'
    ctx.body = html
  }
}