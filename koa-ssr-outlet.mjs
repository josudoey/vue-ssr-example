import VueRouter from 'vue-router'
import createSSRApp from './vue/create-ssr-app.js'
import createRenderer from './vue/create-renderer.mjs'
import clientManifest from './vue/ssr-manifest.js'

const { isNavigationFailure, NavigationFailureType } = VueRouter
const renderer = createRenderer(clientManifest)

export default async function (ctx, next) {
  const vm = await createSSRApp(ctx.state)
  const { $router } = vm
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
  const html = await renderer.renderToString(vm, {
    state: ctx.state
  })

  ctx.type = 'text/html'
  ctx.body = html
}
