import compose from 'koa-compose'
import expose from '~webpack/expose.js'
import { createBundleRenderer } from '~webpack/vue-server-renderer/index.js'
import vueSSRClientMiddleware from '~webpack/dev-middleware/vue-ssr-client.js'
import create from './create.mjs'
import once from 'lodash/once.js'
import router from '../router.mjs'

const wrap = function (middleware) {
  return async function (ctx, next) {
    const { req, res } = ctx
    const { end: originEnd } = res
    let body
    let isEnd = false
    res.end = function (content) {
      isEnd = true
      body = content
    }
    await middleware(req, res, function () {})
    res.end = originEnd
    if (isEnd) {
      ctx.status = 200
      ctx.body = body
      return
    }
    await next()
  }
}

const createMiddleware = once(async function () {
  const [manifest, bundle] = await Promise.all([
    expose.resolve.development.manifest(),
    expose.resolve.development.bundle()
  ])
  const bundleRenderer = createBundleRenderer(bundle, {
    clientManifest: manifest
  })
  const renderer = create(bundleRenderer)
  for (const route of expose.routes) {
    router.get(route.path, renderer)
  }
  return compose([wrap(vueSSRClientMiddleware), router.routes()])
})

let middleware = async function (ctx) {
  middleware = await createMiddleware()
  await middleware(ctx)
}

export default middleware
