import VueRouter from 'vue-router'
import createSSRApp from './vue/create-ssr-app.js'
import createRenderer from './vue/create-renderer.mjs'
import clientManifest from './vue/ssr-manifest.js'
import createDebug from 'debug'
const debug = createDebug('app:koa-ssr-outlet')

const { isNavigationFailure, NavigationFailureType } = VueRouter
const renderer = createRenderer(clientManifest)

export default async function (ctx, next) {
  const routeName = ctx._matchedRouteName
  debug('routeName', routeName)
  await next()

  if (ctx.headers['x-xsrf-token']) {
    // api only
    return
  }

  const vm = await createSSRApp(ctx.store)
  const { $router, $store } = vm
  $store.replaceState(ctx.state)

  const errOrRoute = await $router.push(ctx.url).catch((err) => err)
  // see https://router.vuejs.org/guide/advanced/navigation-failures.html#navigation-failures-s-properties
  if (isNavigationFailure(errOrRoute, NavigationFailureType.redirected)) {
    ctx.redirect($router.currentRoute.path)
    return
  }

  const matchedComponents = $router.getMatchedComponents()
  if (!matchedComponents.length) {
    ctx.throw(errOrRoute)
    return
  }

  await new Promise((resolve) => {
    return vm.$router.onReady(resolve)
  })

  debug('renderToString')
  const html = await renderer.renderToString(vm, {
    state: ctx.state,
    rendered () {
      // see https://ssr.vuejs.org/guide/data.html#final-state-injection
      // see https://github.com/vuejs/vue/blob/0603ff695d2f41286239298210113cbe2b209e28/src/server/create-renderer.js#L89

      debug('rendered')
      const meta = vm.$route.meta
      debug('meta', meta.name)
    }
  })
  debug('renderToString done')

  ctx.status = 200
  ctx.type = 'text/html'
  ctx.body = html
}
