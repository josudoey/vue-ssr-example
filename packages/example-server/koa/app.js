import staticCache from 'koa-static-cache'
export { createRouter } from './router.js'

export function createBrowserStatic ({
  browserOutputPath,
  publicPath
}) {
  return staticCache(browserOutputPath, {
    prefix: publicPath,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    dynamic: true
  })
}
