const Io = 'io'
export function extendIo (ctx, ioSocketServer) {
  Object.defineProperties(ctx, {
    [Io]: {
      get () {
        return ioSocketServer
      }
    }
  })
}
