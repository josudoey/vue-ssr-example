import { provide, inject } from './index.js'
import { extendConfig } from './context/config.js'
import * as dotenv from 'dotenv'
const key = Symbol('koa#config')

export function createConfigPlugin () {
  return {
    install (app) {
      const config = dotenv.config()
      extendConfig(app, config)
      provide(key, config)
    }
  }
}

export function useConfig () {
  return inject(key)
}
