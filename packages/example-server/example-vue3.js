import KoaRouter from 'koa-router'
import { createRequire } from 'module'

function createSSR ({ ssrModulePath }) {
  return createRequire(import.meta.url)(ssrModulePath)
}

function createManifest ({ manifestPath }) {
  const manifest = createRequire(import.meta.url)(manifestPath)
  return manifest
}

export function createRoute (ssr) {
  const {
    RedirectedError,
    createHtmlRenderer,
    manifest
  } = ssr
  const htmlRenderer = createHtmlRenderer({
    manifest
  })
  return async function (ctx, next) {
    try {
      const { rpc } = ctx
      const html = await htmlRenderer.render(ctx.path, {
        rpc
      })

      ctx.status = 200
      ctx.type = 'text/html'
      ctx.body = html
    } catch (err) {
      if (err instanceof RedirectedError) {
        if (!err.currentRoute.name) {
          ctx.redirect('/')
          return
        }
        ctx.redirect(err.currentRoute.fullPath)
        return
      }
      ctx.throw(err)
    }
  }
}

export default {
  install (app, modulePaths) {
    const {
      manifestPath,
      ssrModulePath
    } = modulePaths

    const ssr = createSSR({ ssrModulePath })
    const {
      existsRoute
    } = ssr
    const manifest = createManifest({ manifestPath })

    const existsSsrRoute = async function (ctx, next) {
      // see https://next.router.vuejs.org/api/#resolve
      //     https://next.router.vuejs.org/api/#routelocationnormalized
      if (!existsRoute(ctx.path)) {
        return
      }
      await next()
    }

    const ssrRoute = createRoute({
      ...ssr,
      manifest
    })

    const router = new KoaRouter()
    router.get('/v3(.*)', existsSsrRoute, ssrRoute)
    app.use(router.routes())
  }
}
