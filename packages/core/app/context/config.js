const Config = 'config'
export function extendConfig (ctx, config) {
  Object.defineProperties(ctx, {
    [Config]: {
      get () {
        return config
      }
    }
  })
}
