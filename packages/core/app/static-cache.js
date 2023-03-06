import KoaStaticCache from 'koa-static-cache'

export function createKoaStaticCachePlugin (dir, options) {
  const staticCache = KoaStaticCache(dir, options)
  return {
    install (app) {
      app.use(staticCache)
    }
  }
}
