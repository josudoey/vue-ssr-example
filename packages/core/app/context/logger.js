export const Logger = 'logger'
export function extendLogger (ctx, logger) {
  Object.defineProperties(ctx, {
    [Logger]: {
      get () {
        return logger
      }
    }
  })
}
