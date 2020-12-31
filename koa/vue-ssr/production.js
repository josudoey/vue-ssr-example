const path = require('path')
const staticCache = require('koa-static-cache')
const expose = require('~webpack/expose.js')
const create = require('./create.js')
const once = require('lodash/once.js')
const { createBundleRenderer } = require('~webpack/vue-server-renderer/index.js')

const createRenderer = once(async function () {
  const [manifest, bundle] = await Promise.all([
    expose.resolve.production.manifest(),
    expose.resolve.production.bundle()
  ])

  const bundleRenderer = createBundleRenderer(bundle, {
    clientManifest: manifest
  })
  return create(bundleRenderer)
})

module.exports = async function (ctx, next) {
  const renderer = await createRenderer()
  await renderer(ctx, next)
}

const contentBase = path.join(expose.vueSSRClientPath, expose.publicPath)
const distStaticCache = staticCache(contentBase, {
  prefix: expose.publicPath,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
  dynamic: true
})
module.exports.static = distStaticCache
module.exports.routes = expose.routes
