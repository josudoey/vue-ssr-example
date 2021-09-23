import VueRouter from 'vue-router'
import createSSR from './create-ssr.js'
import manifest from './manifest.js'

const { isNavigationFailure, NavigationFailureType } = VueRouter
const { render, createSSRApp } = createSSR
export default async function (ctx, next) {
  const vm = await createSSRApp(ctx)
  const { $router } = vm
  const err = await $router.push(ctx.url).catch(function (err) { return err })
  // see https://router.vuejs.org/guide/advanced/navigation-failures.html#navigation-failures-s-properties
  if (isNavigationFailure(err, NavigationFailureType.redirected)) {
    ctx.redirect($router.currentRoute.path)
    return
  }

  const matchedComponents = $router.getMatchedComponents()
  if (!matchedComponents.length) {
    return
  }
  const meta = vm.$meta()
  const html = await render.renderToString(vm, {
    state: ctx.state,
    meta: meta,
    manifest: manifest
  })

  ctx.type = 'text/html'
  ctx.body = html
}
