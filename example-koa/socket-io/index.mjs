import { Server } from 'socket.io'

export function extendKoaIo (context, io) {
  Object.defineProperties(context, {
    io: {
      get () {
        return io
      },
      configurable: true
    }
  })
}

export function createSocketIo (httpServer) {
  const io = new Server(httpServer)
  return io
}
