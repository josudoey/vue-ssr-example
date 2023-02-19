import Koa from 'koa'

let currentInstance = null
const setCurrentInstance = (instance) => {
  currentInstance = instance
}

export const getCurrentInstance = () => currentInstance
function unsetCurrentInstance () {
  currentInstance = null
}

export function warn (message) {
  console.error(message)
}

export function provide (key, value) {
  // ref https://github.com/vuejs/core/blob/a0e7dc334356e9e6ffaa547d29e55b34b9b8a04d/packages/runtime-core/src/apiInject.ts#L9
  if (!currentInstance) {
    warn('provide() can only be used inside install().')
  } else {
    const provides = currentInstance.provides
    provides[key] = value
  }
}

export function inject (key, defaultValue) {
  // ref https://github.com/vuejs/core/blob/a0e7dc334356e9e6ffaa547d29e55b34b9b8a04d/packages/runtime-core/src/apiInject.ts#L48
  const instance = currentInstance
  if (instance) {
    const provides = instance.provides
    if (provides && key in provides) {
      return provides[key]
    } else if (arguments.length > 1) {
      return defaultValue
    } else {
      warn(`injection "${String(key)}" not found.`)
    }
  } else {
    warn('inject() can only be used inside install().')
  }
}

function createAppContext (options) {
  const app = new Koa(options)
  return {
    app,
    provides: Object.create(null)
  }
}

export function createApp (options) {
  // ref https://github.com/vuejs/core/blob/a0e7dc334356e9e6ffaa547d29e55b34b9b8a04d/packages/runtime-core/src/apiCreateApp.ts#L205
  const installedPlugins = new Set()
  const ctx = createAppContext(options)
  const app = {
    context () {
      return ctx
    },
    use (plugin, ...options) {
      if (installedPlugins.has(plugin)) {
        warn('Plugin has already been applied to target app.')
        return
      }

      if (typeof plugin === 'function') {
        installedPlugins.add(plugin)
        setCurrentInstance(ctx)
        plugin(ctx.app, ...options)
        unsetCurrentInstance()
        return this
      }

      installedPlugins.add(plugin)
      setCurrentInstance(ctx)
      plugin.install(ctx.app, ...options)
      unsetCurrentInstance()
      return this
    },
    callback () {
      return ctx.app.callback()
    }
  }

  return app
}
