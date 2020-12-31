const { createBundleRenderer } = require('~webpack/vue-server-renderer/index.js')
const vueSSRClientMiddleware = require('~webpack/dev-middleware/vue-ssr-client.js')
const create = require('./create.js')
const once = require('lodash/once.js')
const expose = require('~webpack/expose.js')
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
const createRenderer = once(async function () {
  const [manifest, bundle] = await Promise.all([
    expose.resolve.development.manifest(),
    expose.resolve.development.bundle()
  ])
  const bundleRenderer = createBundleRenderer(bundle, {
    clientManifest: manifest
  })
  const renderer = create(bundleRenderer)
  return renderer
})

module.exports = async function (ctx, next) {
  const renderer = await createRenderer()
  await renderer(ctx, next)
}

module.exports.static = wrap(vueSSRClientMiddleware)
module.exports.routes = expose.routes
