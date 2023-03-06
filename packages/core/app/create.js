import { createComposable } from 'composable-hooks'
import Koa from 'koa'

const {
  getCurrentInstance,
  provide,
  inject,
  createContext
} = createComposable()

export { provide, inject }

export function createCoreApp (options) {
  // ref https://github.com/vuejs/core/blob/a0e7dc334356e9e6ffaa547d29e55b34b9b8a04d/packages/runtime-core/src/apiCreateApp.ts#L205
  const app = new Koa(options)
  const { use } = createContext(app)

  return {
    use (plugin, ...options) {
      use(plugin, ...options)
      return this
    },
    instance () {
      return app
    },
    callback () {
      return app.callback()
    }
  }
}

export function useApp () {
  return getCurrentInstance()
}
