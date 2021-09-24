import VueRouter from 'vue-router'
import createSSR from './create-ssr.js'
import createRenderer from './vue/outlet/ssr/create.mjs'
import clientManifest from './vue/outlet/ssr/manifest.js'

const { isNavigationFailure, NavigationFailureType } = VueRouter
const createSSRApp = createSSR
const renderer = createRenderer(clientManifest)

export default async function (ctx, next) {
  const vm = await createSSRApp(ctx)
  const { $router } = vm
  const err = await $router.push(ctx.url).catch((err) => err)
  // see https://router.vuejs.org/guide/advanced/navigation-failures.html#navigation-failures-s-properties
  if (isNavigationFailure(err, NavigationFailureType.redirected)) {
    ctx.redirect($router.currentRoute.path)
    return
  }

  const matchedComponents = $router.getMatchedComponents()
  if (!matchedComponents.length) {
    return
  }
  const html = await renderer.renderToString(vm, {
    state: ctx.state
  })

  ctx.type = 'text/html'
  ctx.body = html
}
