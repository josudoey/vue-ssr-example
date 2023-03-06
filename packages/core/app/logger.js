import { provide, inject } from './index.js'
import { extendLogger } from './context/logger'
import logger from 'npmlog'

const key = Symbol('koa#logger')

export function createLoggerPlugin () {
  return {
    install (app) {
      extendLogger(app.context, logger)
      provide(key, logger)
    }
  }
}

export function useLogger () {
  return inject(key)
}
