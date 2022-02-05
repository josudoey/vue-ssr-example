import env from './env.js'
const ssrModule = await import(env.ssrPath)
const createSSRAppModule = ssrModule.default
const { createRenderer, createRouter, createStore, createSSRApp, isNavigationFailure, NavigationFailureType } = createSSRAppModule
export { createRenderer, createSSRApp, createRouter, createStore, isNavigationFailure, NavigationFailureType }
