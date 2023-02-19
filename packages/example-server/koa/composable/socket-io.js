import { Server } from 'socket.io'
import { provide, warn } from './app.js'
function createIoContext (httpServer) {
  const io = new Server(httpServer)
  return {
    io,
    provides: Object.create(null)
  }
}

const appSocketIoKey = Symbol('koa#io')

export function createSocketIoPlugin (httpServer) {
  const plugins = []

  const ctx = createIoContext(httpServer)
  provide(appSocketIoKey, ctx.io)
  return {
    context () {
      return ctx
    },
    use (plugin, ...options) {
      plugins.push([plugin, options])
      return this
    },
    install (app) {
      Object.defineProperties(app.context, {
        [appSocketIoKey]: {
          get () {
            return ctx.io
          },
          configurable: true
        }
      })

      const installedPlugins = new Set()
      for (const [plugin, options] of plugins) {
        if (installedPlugins.has(plugin)) {
          warn('Plugin has already been applied to target app.')
          continue
        }

        if (typeof plugin === 'function') {
          installedPlugins.add(plugin)
          plugin(ctx.io, ...options)
          continue
        }

        installedPlugins.add(plugin)
        plugin.install(ctx.io, ...options)
      }
    }
  }
}

export function get (ctx) {
  return ctx[appSocketIoKey]
}
