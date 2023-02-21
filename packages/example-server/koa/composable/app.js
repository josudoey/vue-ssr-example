import Koa from 'koa'
import { createUseableContext } from './useable.js'

export function warn (message) {
  console.error(message)
}

const {
  getCurrentInstance,
  provide,
  inject,
  createUseable
} = createUseableContext({ warn })

export { getCurrentInstance, provide, inject }

export function createApp (options) {
  // ref https://github.com/vuejs/core/blob/a0e7dc334356e9e6ffaa547d29e55b34b9b8a04d/packages/runtime-core/src/apiCreateApp.ts#L205
  const app = new Koa(options)
  const useable = createUseable(app)

  return {
    instance () {
      return app
    },
    use (plugin, ...options) {
      useable.use(plugin, ...options)
      return this
    },
    callback () {
      return app.callback()
    }
  }
}
