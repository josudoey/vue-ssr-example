import createDebug from 'debug'
import KoaRouter from 'koa-router'
import * as xsrfToken from './koa/route/xsrf-token.js'

import { createRequire } from 'module'
const debug = createDebug('app:example-vue2')
function createSSR ({ ssrModulePath }) {
  const ssrModuleExports = createRequire(import.meta.url)(ssrModulePath)
  return ssrModuleExports
}

function createManifest ({ manifestPath }) {
  const manifest = createRequire(import.meta.url)(manifestPath)
  return manifest
}

export function createRoute (ssr) {
  const {
    createHtmlRenderer,
    RedirectedError,
    manifest
  } = ssr

  const htmlRenderer = createHtmlRenderer({
    manifest
  })
  return async function (ctx, next) {
    const routeName = ctx._matchedRouteName
    debug('path', ctx.path)
    debug('routeName', routeName)

    if (ctx.headers['x-xsrf-token']) {
      // is api
      return
    }

    debug('renderToString')
    try {
      const { rpc } = ctx
      const html = await htmlRenderer.render(ctx.path, {
        rpc
      })
      debug('render done')

      ctx.status = 200
      ctx.type = 'text/html'
      ctx.body = html
    } catch (err) {
      if (err instanceof RedirectedError) {
        if (!err.currentRoute.name) {
          debug('invalid route; redirect default /')
          ctx.redirect('/')
          return
        }
        debug(`redirect to ${err.currentRoute.fullPath}`)
        ctx.redirect(err.currentRoute.fullPath)
        return
      }

      ctx.throw(err)
    }
  }
}

export default {
  install (app, modulePaths) {
    const { manifestPath, ssrModulePath } = modulePaths
    const manifest = createManifest({ manifestPath })
    const ssr = createSSR({ ssrModulePath })

    const { existsRoute } = ssr
    const existsSsrRoute = async function (ctx, next) {
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
    router.get('/(.*)', existsSsrRoute, xsrfToken.create, ssrRoute)
    app.use(router.routes())
  }
}
