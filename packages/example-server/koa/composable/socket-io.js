import { Server } from 'socket.io'
import { provide, inject } from './app.js'
import { createComposable } from 'composable-hook'

const {
  getCurrentInstance,
  createUseable
} = createComposable()

export { getCurrentInstance, provide, inject }

const appSocketIoKey = Symbol('koa#io')

export function createSocketIoPlugin (httpServer) {
  const plugins = []
  const io = new Server(httpServer)
  const useable = createUseable(io)

  return {
    instance () {
      return io
    },
    use (plugin, ...options) {
      plugins.push([plugin, options])
      return this
    },
    install (app) {
      provide(appSocketIoKey, io)
      Object.defineProperties(app.context, {
        [appSocketIoKey]: {
          get () {
            return io
          },
          configurable: true
        }
      })

      for (const [plugin, options] of plugins) {
        useable.use(plugin, ...options)
      }
    }
  }
}

export function useSocketIo () {
  return inject(appSocketIoKey)
}
