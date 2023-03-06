import { provide, inject } from './index.js'
import KoaSession from 'koa-session'

const key = Symbol('koa#session')

export function createSessionPlugin (options) {
  return {
    install (app) {
      const session = KoaSession(options, app)
      app.use(session)
      provide(key, session)
    }
  }
}

export function useSession () {
  return inject(key)
}
