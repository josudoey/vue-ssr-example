import { Server } from 'socket.io'
import { provide, inject } from './index.js'
import { extendIo } from './context/io.js'
const key = Symbol('koa#io')

export function createSocketIoPlugin (httpServer) {
  const io = new Server(httpServer)
  return {
    install (app) {
      provide(key, io)
      extendIo(app.context, io)
    }
  }
}

export function useSocketIoServer () {
  return inject(key)
}
