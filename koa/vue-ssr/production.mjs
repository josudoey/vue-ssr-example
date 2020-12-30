import path from 'path'
import staticCache from 'koa-static-cache'
import compose from 'koa-compose'
import expose from '~webpack/expose.js'
import create from './create.mjs'
import once from 'lodash/once.js'
import { createBundleRenderer } from '~webpack/vue-server-renderer/index.js'
import router from '../router.mjs'

const createMiddleware = once(async function () {
  const [manifest, bundle] = await Promise.all([
    expose.resolve.production.manifest(),
    expose.resolve.production.bundle()
  ])

  const bundleRenderer = createBundleRenderer(bundle, {
    clientManifest: manifest
  })
  const renderer = create(bundleRenderer)
  const contentBase = path.join(expose.vueSSRClientPath, expose.publicPath)
  const distStaticCache = staticCache(contentBase, {
    prefix: expose.publicPath,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
    dynamic: true
  })

  for (const route of expose.routes) {
    router.get(route.path, renderer)
  }

  return compose([distStaticCache, router.routes()])
})

let middleware = async function (ctx) {
  middleware = await createMiddleware()
  await middleware(ctx)
}

export default middleware
