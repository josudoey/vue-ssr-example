import { provide, inject } from './app.js'
import KoaSession from 'koa-session'

const appSessionKey = Symbol('koa#session')

export function createSessionPlugin (options) {
  return {
    install (app) {
      const session = new KoaSession(options, app)
      provide(appSessionKey, session)
      app.use(session)
    }
  }
}

export function useSession () {
  return inject(appSessionKey)
}
