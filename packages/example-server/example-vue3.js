import KoaRouter from 'koa-router'

import {
  createHtmlRenderer,
  RedirectedError,
  existsRoute,
  manifest
} from '@vue-ssr-example/example-ssr/example-vue3.js'

const htmlRenderer = createHtmlRenderer({
  manifest
})

async function onlySsrRoute (ctx, next) {
  // see https://next.router.vuejs.org/api/#resolve
  //     https://next.router.vuejs.org/api/#routelocationnormalized
  if (!existsRoute(ctx.path)) {
    return
  }

  await next()
}

async function ssrRoute (ctx, next) {
  const routeName = ctx._matchedRouteName

  if (ctx.headers['x-xsrf-token']) {
    // is api
    return
  }

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

export default {
  install (app) {
    const router = new KoaRouter()
    router.get('/v3(.*)', onlySsrRoute, ssrRoute)
    app.use(router.routes())
  }
}
