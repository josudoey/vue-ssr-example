import { createKoaRpcAdapter } from './rpc.js'

const CONTEXT_RPC = Symbol('context#rpc')

export function extendKoaStore (context) {
  Object.defineProperties(context, {
    rpc: {
      get () {
        if (this[CONTEXT_RPC]) {
          return this[CONTEXT_RPC]
        }
        this[CONTEXT_RPC] = createKoaRpcAdapter(this)
        return this[CONTEXT_RPC]
      }
    }
  })
}
