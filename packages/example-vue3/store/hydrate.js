import { createStore, createStoreOptions } from '../store/index.js'
import { createAxiosRpcAdapter } from './rpc/adapter.js'
import { parse as InitalStateParse } from '@vue-ssr-example/initial-state'

export function getHydrateStore (window) {
  const rpc = createAxiosRpcAdapter('/')
  if (!window.__INITIAL_STATE__) {
    return createStore(createStoreOptions(rpc))
  }
  const initalState = InitalStateParse(window.__INITIAL_STATE__)
  delete window.__INITIAL_STATE__
  const store = createStore(createStoreOptions(rpc))
  store.replaceState(initalState)
  return store
}
