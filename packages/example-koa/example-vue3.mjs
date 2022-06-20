import KoaRouter from 'koa-router'

export function createRoute (ssr) {
  const {
    createRenderer,
    createApp,
    createMemoryRouter,
    createPinia,
    manifest
  } = ssr
  const renderer = createRenderer(manifest)
  return async function (ctx, next) {
    const $router = createMemoryRouter()
    await $router.push(ctx.url)
    await $router.isReady()

    const pinia = createPinia()
    const app = await createApp().use(pinia).use($router)
    const html = await renderer.renderToString(app)

    ctx.status = 200
    ctx.type = 'text/html'
    ctx.body = html
  }
}

export default {
  install (app, options) {
    const {
      createRenderer,
      createApp,
      createMemoryRouter,
      createPinia,
      manifest
    } = options

    const vueRouter = createMemoryRouter()
    const matchedComponent = async function (ctx, next) {
      // see https://next.router.vuejs.org/api/#resolve
      //     https://next.router.vuejs.org/api/#routelocationnormalized
      const routeLocation = vueRouter.resolve(ctx.path)
      if (!routeLocation.matched.length) {
        return
      }
      await next()
    }

    const ssrRoute = createRoute({
      createRenderer,
      createApp,
      createMemoryRouter,
      createPinia,
      manifest
    })

    const router = new KoaRouter()
    router.get('/v3(.*)', matchedComponent, ssrRoute)
    app.use(router.routes())
  }
}
