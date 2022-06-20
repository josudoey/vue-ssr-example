import { createRequire } from 'module'
export default function ({ ssrPath }) {
  const ssrModuleDefault = createRequire(import.meta.url)(ssrPath)
  const { createRenderer, createRouter, createStore, createApp, isNavigationFailure, NavigationFailureType } = ssrModuleDefault
  return { createRenderer, createRouter, createStore, createApp, isNavigationFailure, NavigationFailureType }
}
