import createDebug from 'debug'
import KoaRouter from 'koa-router'
import * as xsrfToken from './koa/route/xsrf-token.js'
import {
  createHtmlRenderer,
  RedirectedError,
  existsRoute,
  manifest
} from '@vue-ssr-example/example-ssr/example-vue2.js'

const debug = createDebug('app:example-vue2')

const htmlRenderer = createHtmlRenderer({
  manifest
})

async function onlySsrRoute (ctx, next) {
  if (!existsRoute(ctx.path)) {
    return
  }

  await next()
}

async function ssrRoute (ctx, next) {
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

export default {
  install (app) {
    const router = new KoaRouter()
    router.get('/(.*)', onlySsrRoute, xsrfToken.create, ssrRoute)
    app.use(router.routes())
  }
}
