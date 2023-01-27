import { createStore, createStoreOptions } from '../store/index.js'
import { unpack } from 'msgpackr/unpack'

function decode (encoded) {
  const decoded = window.atob(encoded)
  const chars = decoded.split('').map(x => x.charCodeAt(0))
  const data = new Uint8Array(chars)
  return unpack(data)
}

export function getHydrateStore (window) {
  const rpc = {}
  if (!window.__INITIAL_STATE__) {
    return createStore(createStoreOptions(rpc))
  }
  const initalState = window.__INITIAL_STATE__
  delete window.__INITIAL_STATE__
  const state = decode(initalState)
  const store = createStore(createStoreOptions(rpc))
  store.replaceState(state)
  return store
}
